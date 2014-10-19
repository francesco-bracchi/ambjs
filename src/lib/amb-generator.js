var expr = require('./expression'),
    trampoline = require ('./trampoline');

var ambGenerator = function (gen) {
  return expr(function (succ, fail) {
    return trampoline(function () {
      var next = function () {
        var val = gen();
        return val !== undefined ? succ (val, function () {
          return next();
        }) : fail();
      };
      return next();
    });
  });
};

module.exports = ambGenerator;
