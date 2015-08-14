var assert = require('assert');
var MockDate = require('../../mock_date');

//////////////////////////////////////////////////////////////////////////
// Test date constructors as used by local timezone mode in node-mysql (local strings)
var test_str = '2015-01-01 01:23:45.678';
MockDate.register('UTC');
assert.equal(1420104225678 - 8*60*60*1000, new Date(test_str).getTime());
MockDate.register('US/Pacific');
assert.equal(1420104225678, new Date(test_str).getTime());
MockDate.register('US/Eastern');
assert.equal(1420104225678 - 3*60*60*1000, new Date(test_str).getTime());

MockDate.register('US/Pacific');
test_str = '2015-03-08 01:30:00.000'; // right before entering PDT
assert.equal(1425807000000, new Date(test_str).getTime());
test_str = '2015-03-08 02:30:00.000'; // doesn't exist, ends up 1:30am
assert.equal(1425807000000, new Date(test_str).getTime());
test_str = '2015-03-08 03:30:00.000'; // in PDT
assert.equal(1425810600000, new Date(test_str).getTime());
test_str = '2014-11-02 01:00:00.000'; // leaving PDT, JS Date returns 1am PST, not 1am PDT
assert.equal(1414918800000, new Date(test_str).getTime());



//////////////////////////////////////////////////////////////////////////
// Test that the mocked date behaves exactly the same as the system date when
//   mocking the same timezone.

if (!new MockDate.OrigDate().toString().match(/\(PDT\)|\(PST\)/)) {
  // Because we only have timezone info for a couple timezones, we can only test
  //   this if the timezone we're mocking is the same as the system timezone.
  // In theory this could be extended to be able to test any timezone for whic
  //   we have timezone data.
  assert.ok(false, 'The remaining tests only work if the local system timezone is Pacific');
}

MockDate.register('US/Pacific');

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

function pad2(v) {
  return ('0' + v).slice(-2);
}

var ts = new Date('2013-01-01T00:00:00.000Z').getTime();
var was_ok = true;
var last = ts;
var end = ts + 5*365*24*60*60*1000;
for (; ts < end; ts += 13*60*1000) {
  orig.setTime(ts);
  mock.setTime(ts);
  assert.equal(orig.toISOString(), mock.toISOString());
  var ok = true;
  function check(label) {
    function check2(fn) {
      if (orig[fn]() !== mock[fn]()) {
        ok = false;
        if (was_ok) {
          console.log('  ' + fn + ' (' + label + ')', orig[fn](), mock[fn]());
        }
      }
    }
    check2('getTimezoneOffset');
    check2('getHours');
    check2('getTime');
  }
  check('setTime');
  var test = new MockDate.OrigDate(ts);
  orig = new MockDate.OrigDate('2015-01-01');
  mock = new Date('2015-01-01');
  orig.setFullYear(test.getUTCFullYear());
  mock.setFullYear(test.getUTCFullYear());
  orig.setMinutes(test.getUTCMinutes());
  mock.setMinutes(test.getUTCMinutes());
  orig.setHours(test.getUTCHours());
  mock.setHours(test.getUTCHours());
  check('setFullYear/Minutes/Hours');
  orig.setDate(test.getUTCDate());
  mock.setDate(test.getUTCDate());
  check('setDate');
  var str = test.getUTCFullYear() + '-' + pad2(test.getUTCMonth() + 1) + '-' + pad2(test.getUTCDate()) + ' ' +
    pad2(test.getUTCHours()) + ':' + pad2(test.getUTCMinutes()) + ':' + pad2(test.getUTCSeconds());
  orig = new MockDate.OrigDate(str);
  mock = new Date(str);
  check('constructor ' + str);
  if (was_ok !== ok) {
    console.log((ok ? 'OK    ' : 'NOT OK') + ' - ' + ts + ' (' + (ts - last) + ') ' + orig.toISOString() + ' (' + orig.toLocaleString() + ')');
    last = ts;
    was_ok = ok;
  }
}
