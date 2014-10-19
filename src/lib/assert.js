var amb = require('./amb'),
    ret = require ('./ret');

var assert = function (t) {
  return t ? ret(true): amb();
};

module.exports = assert;
