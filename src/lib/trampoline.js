var Trampoline = function (fn) {
  this.tick = fn;
};

var run = function (t) {
  while (t instanceof Trampoline) {
    t = t.tick();
  };
  return t;
};

Trampoline.prototype.run = function () {
  return run(this);
};

var trampoline = function (fn) {
  return new Trampoline (fn);
};

module.exports = trampoline;
