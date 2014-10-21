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

var fail = function () {
  throw new Error('Impossible!');
};

var default_options = {
  ids: false,
  increment: 2,
  limit: 32,
  succ: succ,
  fail: fail
};

var merge = function (as) {
  var result = {};
  as.forEach(function (a) {
    if (a) 
      for (var j in a) 
        result[j] = a[j];
  });
  return result;
};

Expression.prototype.run = function (opts) {
  var options = merge([default_options, opts]),
      self = this,
      ids = options.ids,
      limit = options.limit,
      increment = options.increment,
      succ = function (v, fail, ff) {
        return options.succ (v, fail);
      },
      fail = function () {
        if (! ids) return options.fail();
        limit += increment;
        return self.eval(succ, fail, limit).run();
      };
  return this.eval(succ, fail, ids ? limit : undefined).run();
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
