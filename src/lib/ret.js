var expr = require('./expression'),
    trampoline = require('./trampoline');

var ret = function (value) {
  return expr(function (succ, fail, ff) {
    return trampoline (function () {
      return succ (value, fail, ff);
    });
  });
};

module.exports = ret;
