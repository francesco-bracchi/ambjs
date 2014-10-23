// -*- mode: js -*-

"use strict";

var ret = require ('./ret');

var mapA = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  var max = args.reduce(function (m, a) {
    return a.length >= m ? a.length : m; 
  },0);
  var loop = function (j, es) {
    if (j >= max) return ret(es);
    var row = args.map(function (a) { 
      return a[j]; 
    });
    return ambBlock {
      var e = fn.apply(null, row);
      loop (j + 1, es.concat([e]));
    };
  };
  return loop (0, []);
};

module.exports = mapA;
