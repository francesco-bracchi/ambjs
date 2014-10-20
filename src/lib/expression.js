var trampoline = require ('./trampoline');

var Expression = function (fn) { 
  this.eval = fn;
};

var succ = function (v, fail, ff) {
  return {
    value: v,
    next: fail
  };
};

var factor = 2;

Expression.prototype.run = function (ids) {
  if (ids == true) ids = 32;
  var e = this, 
      fail = function () {
        if (ids === undefined) 
          throw new Error('Impossible!');
        return e.eval(succ, fail, Math.round(factor*ids)).run();
      };
  return this.eval(succ, fail, ids).run();
};

var bind = function (e, next) {
  return expression(function (succ, fail, ff) {
    return e.eval (function (v, _fail, _ff) {
      return trampoline(function () {
        return next(v).eval(succ, _fail, _ff);
      });
    }, fail, ff);
  });
};

Expression.prototype.bind = function (next) {
  return bind (this, next);
};

var expression = function (fn) {
  return new Expression (fn);
};

module.exports = expression;
