// -*- mode: js -*-

"use strict";

var run = function (t) {
  while (t.tick) {
    t = t.tick();
  };
  return t;
};

var proto = {};

proto.run = function () {
  return run(this);
};

var trampoline = function (fn) {
  var result = Object.create (proto);
  result.tick = fn;
  return result;
};

module.exports = trampoline;
