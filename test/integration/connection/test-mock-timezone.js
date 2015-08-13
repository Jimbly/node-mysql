var assert = require('assert');
var MockDate = require('../../mock_date');

MockDate.register('Pacific');

function test(d) {
  var ret = [];
  ret.push(d.getTimezoneOffset());
  ret.push(d.getHours());
  d.setTime(new Date('2015-03-08T02:30:11.000Z').getTime());
  ret.push(d.getTimezoneOffset());
  ret.push(d.getHours());
  d.setTime(new Date('2015-03-07T02:30:11.000Z').getTime());
  ret.push(d.getTimezoneOffset());
  ret.push(d.getHours());
  d.setTime(new Date('2015-03-09T02:30:11.000Z').getTime());
  ret.push(d.getTimezoneOffset());
  ret.push(d.getHours());
  return ret;
}

var orig = new MockDate.OrigDate();
var mock = new Date();

var ts = new Date('2013-01-01T00:00:00.000Z').getTime();
var was_ok = true;
var last = ts;
for (var ii = 0; ii < 5*365*24; ++ii, ts += 60*1000) {
  orig.setTime(ts);
  mock.setTime(ts);
  assert.equal(orig.toISOString(), mock.toISOString());
  var ok = true;
  function check(fn) {
    if (orig[fn]() !== mock[fn]()) {
      ok = false;
      if (was_ok) {
        console.log('  ' + fn, orig[fn](), mock[fn]());
      }
    }
  }
  check('getTimezoneOffset');
  check('getHours');
  var test = new MockDate.OrigDate(ts);
  orig = new MockDate.OrigDate();
  mock = new Date();
  orig.setDate(test.getUTCDate());
  mock.setDate(test.getUTCDate());
  orig.setHours(test.getUTCHours());
  mock.setHours(test.getUTCHours());
  orig.setFullYear(test.getUTCFullYear());
  mock.setFullYear(test.getUTCFullYear());
  check('getTimezoneOffset');
  check('getHours');
  if (was_ok !== ok) {
    console.log((ok ? 'OK    ' : 'NOT OK') + ' - ' + ts + ' (' + (ts - last) + ') ' + orig.toISOString() + ' (' + orig.toLocaleString() + ')');
    last = ts;
    was_ok = ok;
  }
}
