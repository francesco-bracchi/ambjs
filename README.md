# ambjs

the amb operator is an operator that assigns a value to a variable
in an ambigous way, i.e.

    var v = amb([1,2,3]);

means that v can be either 1 or b or 3.

obviously javascript semantics doesn't support this behaviour, so 
it has to be expressed in a specific context that, thanks to sweetjs
macros can be transformed in javascript.

## Install

    > npm install -save ambjs
    > npm install -save-dev sweetjs

## Example code 

this is taken from the test suite 

    ret = require('../lib/ret'),
    amb = require('../lib/amb'),
    assert = require('../lib/assert'),

    var colors = ['red', 'green', 'yellow', 'blue'];
    var colorSet = ambBlock {
      var germany = amb(colors);
      var france = amb(colors);
      var italy = amb(colors);
      var swiss = amb(colors);
      var austria = amb(colors);
      var slovenia = amb(colors);

      assert (germany != france);
      assert (germany != swiss);
      assert (germany != austria);
      assert (france != swiss);
      assert (france != italy);
      assert (italy != swiss);
      assert (italy != austria);
      assert (italy != slovenia);
      assert (swiss != austria);
      assert (austria != slovenia);
      
      ret ({
        germany: germany,
        france: france,
        italy: italy,
        swiss: swiss,
        austria: austria,
        slovenia: slovenia
      });
    }.run().value;

    console.log(colorSet);

## Transform

to have the javascript code apply the provided macro.

    node_modules/.bin/sjs --module ambjs/macro <file> 

