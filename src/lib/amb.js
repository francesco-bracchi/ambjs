var expr = require('./expression'),
    trampoline = require ('./trampoline');

var amb = function (values) {
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

module.exports = amb;
