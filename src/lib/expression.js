var trampoline = require ('./trampoline');

var Expression = function (fn) { 
  this.eval = fn;
};

var succ = function (v, fail) {
  return {
    value: v,
    next: fail
  };
};

var fail = function (succ, fail) {
  throw new Error ('Impossible!');
};

Expression.prototype.run = function () {
  return this.eval(succ, fail).run();
};

var bind = function (e, next) {
  return expression(function (succ, fail) {
    return e.eval (function (v, _fail) {
      return trampoline(function () {
        return next(v).eval(succ, _fail);
      });
    }, fail);
  });
};

Expression.prototype.bind = function (next) {
  return bind (this, next);
};

var expression = function (fn) {
  return new Expression (fn);
};

module.exports = expression;
