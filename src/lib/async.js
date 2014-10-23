// -*- mode: js -*-

// ## async 
 
// This is a utility handler used to suspend the 
// amb monad execution and restart it later, invoking 
// the `resume` function.

// ### Example

//     ambBlock {
//         var t = async (function (resume) {
//         setTimeout(function () { 
 //           resume ('resumed');
//         }, 1000);
 //       });
//       /* here t value is 'resumed' */
//     }.run();

"use strict";

var expr = require('./expression'),
    trampoline = require('./trampoline');

var async = function (call) {
  return expr(function (succ, fail) {
    return trampoline (function () {
      call (function (value) {
        succ (value, fail).run();
      });
      return 'suspended';
    });
  });
};

module.exports = async;
