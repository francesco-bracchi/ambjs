// -*- mode: js -*-

"use strict";

var ret = require('./ret');

var foreach = function (arr, fn) {
  var loop = function (j) {
    return j < arr.length ? ambBlock {
      fn (arr[j]);
      loop(j+1);
    } : ret();
  };
  return loop(0);
};

module.exports = foreach;
