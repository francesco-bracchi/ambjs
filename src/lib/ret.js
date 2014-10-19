var expr = require('./expression'),
    trampoline = require('./trampoline');

var ret = function (value) {
  return expr(function (succ, fail) {
    return trampoline (function () {
      return succ (value, fail);
    });
  });
};

module.exports = ret;
