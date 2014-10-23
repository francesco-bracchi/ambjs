// -*- mode: js -*-
"use strict";

var trampoline = require('./trampoline'),
    expr = require('./expression');

var callcc = function (fn) {
  return expr (function (succ, fail) {
    return trampoline(function() {
      return fn (function (value) {
        return expr (function (succ_, fail_) {
          return trampoline(function () {
            return succ (value, fail);
          });
        });
      }).eval(succ, fail);
    });
  });
};

module.exports = callcc;
