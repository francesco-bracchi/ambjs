var expr = require('./expression'),
    trampoline = require ('./trampoline');

var ambSet = function (values) {
  return expr(function (succ, fail) {
    return trampoline(function () {
      var next = function (j) {
        return j < values.length ? succ (values[j], function () {
          return next(j+1);
        }) : fail();
      };
      return values ? next(0) : fail();
    });
  });
};

var EndObject = function () {};

EndObject.prototype.toString = function () {
  return "#end_object";
};

var end_object = new EndObject();

var ambGenerator = function (gen) {
  return expr(function (succ, fail) {
    return trampoline(function () {
      var next = function () {
        var val = gen();
        return val instanceof EndObject ? fail () : succ (val, next);
      };
      return next();
    });
  });
};

var amb = function (args) {
  return args instanceof Function ? ambGenerator(args) : ambSet(args);
};

amb.end_object = end_object;

module.exports = amb;
