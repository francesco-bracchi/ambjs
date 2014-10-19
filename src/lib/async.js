var expr = require('./expression'),
    trampoline = require('./trampoline');

 // ## async 
 
 // This is a utility handler used to suspend the 
 // amb monad execution and restart it later, invoking 
 // the `resume` function.
 
 // ### Example

 //     fa {
 //         var t = async (function (resume) {
 //         setTimeout(function () { 
 //           resume ('resumed');
 //         }, 1000);
 //       });
 //       /* here t value is 'resumed' */
 //     }.run();

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
