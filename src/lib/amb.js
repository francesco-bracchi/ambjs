var expr = require('./expression'),
    trampoline = require ('./trampoline');

var ambSet = function (values) {
  return expr(function (succ, fail, ff) {
    return trampoline(function () {
      var next = function (j) {
        var t = ff === undefined,
            l = j < values.length;
        return (t && l) || (l && j < ff)
          ? succ (values[j], function () {
            return next(j + 1);
          }, t ? undefined : ff - 1)
          : fail();
      };
      return values === undefined ? fail() : next(0);
    });
  });
};

var EndObject = function () {};

EndObject.prototype.toString = function () {
  return "#end_object";
};

var end_object = new EndObject();

var ambGenerator = function (gen) {
  return expr(function (succ, fail, ff) {
    return trampoline(function () {
      var next = function (j) {
        var val = gen(),
            t = ff === undefined,
            l = !(val instanceof EndObject);
        return (t && l) || (l && j < ff)
          ? succ (val, function () { 
            return next(j + 1); 
          }, t ? undefined : ff - 1)
        : fail();
      };
      return next(0);
    });
  });
};

var amb = function (args) {
  return args instanceof Function ? ambGenerator(args) : ambSet(args);
};

amb.end_object = end_object;

module.exports = amb;
