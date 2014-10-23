var assert = require('assert'),
    ret = require('../lib/ret'),
    amb = require('../lib/amb'),
    foreach = require('../lib/foreach'),
    ambAssert = require('../lib/assert'),
    callcc = require('../lib/callcc'),
    async = require('../lib/async'),
    map = require('../lib/map');

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

var integers = function (n, m) {
  if (n === undefined) n = 10;
  if (m === undefined) m = 100;
  var r = new Array (n);
  while (n--) {
    r[n] = Math.round(Math.random(m));
  }
  return r;
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
    var colorSet = ambBlock {
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

describe ('Generator', function () {
  var integerGen = function () {
    var j = 0;
    return function () {
      return j++;
    };
  };
  
  var arrayToGenerator = function (array) {
    var j = 0;
    return function () {
      return j < array.length ? array[j++] : amb.end_object;
    };
  };

  it ('should print #end_object', function () {
    assert(amb.end_object.toString() === '#end_object');
  });
  it ('should generate', function () {
    assert(amb(integerGen()).run().value === 0);
  });
  it ('should generate more', function () {
    assert(amb(integerGen()).run().next().value === 1);
  });

  it ('should fail if generator returns end', function () {
    try {
      var v = amb(arrayToGenerator([0,1,2])).run();
      while (v.next)
        v = v.next();
      assert(false);
    } catch(e) {
      assert(e.message === 'Impossible!');
    }
  });

  it ('should not fail if generator returns null ', function () {
    assert(amb(arrayToGenerator([null])).run().value === null);
  });
  it ('should not fail if generator returns 0 ', function () {
    assert(amb(arrayToGenerator([0])).run().value === 0);
  });
  
  it ('should never fail if generator does not return undefined', function () {
    integers().forEach(function (limit) {
      var v = amb(integerGen()).run();
      var j = 0;
      while (v.next && j < limit) {
        v = v.next();
        j++;
      }
      assert(true);
    });
  });
});

describe ('Async', function () {
  var now = function () {
    return (new Date()).getTime();
  };

  it ('should suspend until timeout fires', function (done) {
    ambBlock {
      var delta = ret(10);
      var t0 = ret(now());
      var t = async (function (resume) {
        setTimeout(function () { 
          resume (now());
        }, delta);
      });
      ret(assert(t - t0 >= delta));
      ret(done());
    }.run();
  });
});

describe('CallCC', function () {
  var now = function () {
    return (new Date()).getTime();
  };
  it('should not evaluate expressions after exit', function () {
    callcc(function(exit) {
      return ambBlock {
        var t0 = ret(now());
        exit('exit');
        ret(assert(false));
      };
    }).run();
  });
  it('should return a value if exit is not called', function () {
    assert(callcc(function(exit) {
      return ret ('value');
    }).run().value === 'value');
  });
  it('should evaluate expressions after callcc', function () {
    ambBlock {
      var v = callcc(function(exit) {
        return ambBlock {
          var t0 = ret(now());
          exit('exit');
          ret(assert(false));
        };
      });
      ret(assert(v === 'exit'));
    }.run();
  });
  it('should behave like async', function (done) {
    var timeout = 10;
    callcc(function(exit) {
      return ambBlock {
        var t0 = ret(now());
        var t = callcc(function (resume) {
          setTimeout(function () {
            resume(now()).run();
          }, timeout);
          return exit('exit');
        });
        ret(assert(t - t0 >= timeout));
        ret(done());
      }
    }).run();
  });
});

describe ('Ids', function () {
  var integerGen = function () {
    var j = 0;
    return function () {
      return j++;
    };
  };
  it('should return', function () {
    amb(integerGen()).bind(function (i) {
      return amb(integerGen()).bind(function (j) {
        return ambAssert (i > 10);
      });
    }).run({ids: true});
  });
  it('should iterate ', function () {
    amb([1,2,3,4]).bind(function (i) {
      return amb([5,6,7,8]).bind(function (j) {
        return ambAssert (i * j >= 32);
      });
    }).run({ids: true, limit: 2, factor: 2});
  });
});

describe('Map', function () {
  var range = function (j) {
    var res = new Array(j);
    while(j--) res[j] = j;
    return res;
  };
  it('should return values', function () {
    ambBlock {
      var is = map(function (j) {
        return amb (range(j));
      }, [3,4,5]);
      ambAssert(is[2] >= 4);
      ret(assert(is[2] === 4));
    }.run();
  });

  it('should zip multiple arrays', function () {
    ambBlock {
      var is = map(function (i,j) {
        return amb([i,j]);
      }, [0,1,2,3], ['a','b','c']);
      ambAssert(is[3] === undefined);
      ret(assert(is[3] === undefined));
    }.run();
  });
});
