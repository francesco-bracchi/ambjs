var assert = require('assert'),
    ret = require('../lib/ret'),
    amb = require('../lib/amb'),
    foreach = require('../lib/foreach'),
    ambAssert = require('../lib/assert'),
    callcc = require('../lib/callcc');

var any = function () {
  return [
    undefined,
    null,
    0,
    1,
    "",
    "string",
    [],
    [undefined],
    [1],
    ["string"],
    {},
    {key: 'value'}
  ];
};

var sets = function () {
  return [
    [],
    [0],
    [0,1],
    ['a'],
    ['a', 0],
    ['', '0', 0],
    [undefined],
    [undefined, 0],
    [1,2,3],
    [{key: 'value'}, undefined]
  ];
};

describe('Return', function () {

  it ('should return the returned value', function () {
    any().forEach(function (value) {
      assert(ret(value).run().value === value);
    });
  });
});

describe('Amb', function () {
  it ('should return the first value', function () {
    sets().forEach(function (set) {
      if (set.length) {
        assert(amb(set).run().value === set[0]);
      }
    });
  });

  it ('should move to the next value', function () {
    sets().forEach(function(set) {
      if (set.length >= 2) {
        assert(amb(set).run().next().value == set[1]);
      }
    });
  });
  it ('should fail for argument not specified', function () {
    try {
      amb().run();
    }
    catch(e) {
      assert(e.message === 'Impossible!');
    }
  });

  it ('should fail for empty set', function () {
    try {
      amb([]).run();
    }
    catch(e) {
      assert(e.message === 'Impossible!');
    }
  });

  it ('should always finally fail', function () {
    sets().forEach(function(set) {
      try {
        var v = amb(set).run();
        while (v.next)
          v = v.next();
        assert(false);
      } catch(e) {
        assert(e.message === 'Impossible!');
      }
    });
  });
});

describe ('Bind', function () {
  it ('connects value', function () {
    any().forEach(function(value) {
      assert(ret(value).bind(ret).run().value === ret(value).run().value);
    });
  });
  it ('backtracks', function () {
    sets().forEach(function (set) {
      if (set.length >= 2) {
        var bt = false;
        assert(amb(set).bind(function (v) {
          var bt0 = bt;
          bt = true;
          return bt0 ? ret (v) : amb();
        }).run().value === set[1]);
      }
    });
  });
});

describe ('Assert', function () {
  
  it ('should succeed', function () {
    ambAssert(true).run();
    assert(true);
  });

  it ('should fail', function () {
    try {
      ambAssert(false).run();
      assert(false);
    } catch(e) {
      assert(e.message == 'Impossible!');
    }
  });
});

describe ('Foreach', function () {
  it('should loop', function () {
    sets().forEach (function (set) {
      var counter = 0;
      foreach(set, function (val) {
        counter++;
        return ret(val);
      }).run();
      assert(counter == set.length);
    });
  });
});

describe('example', function () {
  it ('should not fail', function () {
    var colors = ['red', 'green', 'yellow', 'blue'];
    var colorSet = fa {
      var germany = amb(colors);
      var france = amb(colors);
      var italy = amb(colors);
      var swiss = amb(colors);
      var austria = amb(colors);
      var slovenia = amb(colors);

      ambAssert (germany != france);
      ambAssert (germany != swiss);
      ambAssert (germany != austria);
      ambAssert (france != swiss);
      ambAssert (france != italy);
      ambAssert (italy != swiss);
      ambAssert (italy != austria);
      ambAssert (italy != slovenia);
      ambAssert (swiss != austria);
      ambAssert (austria != slovenia);
      
      ret ({
        germany: germany,
        france: france,
        italy: italy,
        swiss: swiss,
        austria: austria,
        slovenia: slovenia
      });
    }.run().value;
    
    assert (colorSet.germany != colorSet.france);
    assert (colorSet.germany != colorSet.swiss);
    assert (colorSet.germany != colorSet.austria);
    assert (colorSet.france != colorSet.swiss);
    assert (colorSet.france != colorSet.italy);
    assert (colorSet.italy != colorSet.swiss);
    assert (colorSet.italy != colorSet.austria);
    assert (colorSet.italy != colorSet.slovenia);
    assert (colorSet.swiss != colorSet.austria);
    assert (colorSet.austria != colorSet.slovenia);
  });
});

// describe('CallCC', function () {
//   it('is', function (done) {
//     callcc(function(exit) {
//       console.log('exit');
//       return fa {
//         var t0 = ret((new Date()).getTime());
//         ret(console.log('1'));
//         var t = callcc(function (resume) {
//           console.log ('resume');
//           setTimeout (function () {
//             console.log('timeout');
//             resume(ret ((new Date()).getTime()));
//           }, 600);
//           return exit(ret('exit-exit'));
//         });
//         ret(console.log('diff:' + (t - t0)));
//         ret(done());
//       };
//     }).run();
//   });
// });
