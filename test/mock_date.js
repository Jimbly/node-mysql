var assert = require('assert');
var OrigDate = Date;

var timezone = 'Pacific';

var tzdata = {
  'UTC': {
    names: [0, 'UTC'],
    transitions: [0, 0, Infinity, 0],
  },
  'Pacific': {
    names: [-7, 'PDT', -8, 'PST'],
    // Generated this data from mysql_tzinfo_to_sql included with MySQL and the
    // tzinfo file on OSX.
    transitions: [
      0, -8,
      9972000, -7,
      25693200, -8,
      41421600, -7,
      57747600, -8,
      73476000, -7,
      89197200, -8,
      104925600, -7,
      120646800, -8,
      126698400, -7,
      152096400, -8,
      162381600, -7,
      183546000, -8,
      199274400, -7,
      215600400, -8,
      230724000, -7,
      247050000, -8,
      262778400, -7,
      278499600, -8,
      294228000, -7,
      309949200, -8,
      325677600, -7,
      341398800, -8,
      357127200, -7,
      372848400, -8,
      388576800, -7,
      404902800, -8,
      420026400, -7,
      436352400, -8,
      452080800, -7,
      467802000, -8,
      483530400, -7,
      499251600, -8,
      514980000, -7,
      530701200, -8,
      544615200, -7,
      562150800, -8,
      576064800, -7,
      594205200, -8,
      607514400, -7,
      625654800, -8,
      638964000, -7,
      657104400, -8,
      671018400, -7,
      688554000, -8,
      702468000, -7,
      720003600, -8,
      733917600, -7,
      752058000, -8,
      765367200, -7,
      783507600, -8,
      796816800, -7,
      814957200, -8,
      828871200, -7,
      846406800, -8,
      860320800, -7,
      877856400, -8,
      891770400, -7,
      909306000, -8,
      923220000, -7,
      941360400, -8,
      954669600, -7,
      972810000, -8,
      986119200, -7,
      1004259600, -8,
      1018173600, -7,
      1035709200, -8,
      1049623200, -7,
      1067158800, -8,
      1081072800, -7,
      1099213200, -8,
      1112522400, -7,
      1130662800, -8,
      1143972000, -7,
      1162112400, -8,
      1173607200, -7,
      1194166800, -8,
      1205056800, -7,
      1225616400, -8,
      1236506400, -7,
      1257066000, -8,
      1268560800, -7,
      1289120400, -8,
      1300010400, -7,
      1320570000, -8,
      1331460000, -7,
      1352019600, -8,
      1362909600, -7,
      1383469200, -8,
      1394359200, -7,
      1414918800, -8,
      1425808800, -7,
      1446368400, -8,
      1457863200, -7,
      1478422800, -8,
      1489312800, -7,
      1509872400, -8,
      1520762400, -7,
      1541322000, -8,
      1552212000, -7,
      1572771600, -8,
      1583661600, -7,
      1604221200, -8,
      1615716000, -7,
      1636275600, -8,
      1647165600, -7,
      1667725200, -8,
      1678615200, -7,
      1699174800, -8,
      1710064800, -7,
      1730624400, -8,
      1741514400, -7,
      1762074000, -8,
      1772964000, -7,
      1793523600, -8,
      1805018400, -7,
      1825578000, -8,
      1836468000, -7,
      1857027600, -8,
      1867917600, -7,
      1888477200, -8,
      1899367200, -7,
      1919926800, -8,
      1930816800, -7,
      1951376400, -8,
      1962871200, -7,
      1983430800, -8,
      1994320800, -7,
      2014880400, -8,
      2025770400, -7,
      2046330000, -8,
      2057220000, -7,
      2077779600, -8,
      2088669600, -7,
      2109229200, -8,
      2120119200, -7,
      2140678800, -8,
    ]
  }
};

function MockDate(param) {
  assert.ok(arguments.length <= 1);
  if (arguments.length) {
    if (param instanceof MockDate) {
      this.d = new OrigDate(param.d);
    } else {
      this.d = new OrigDate(param);
    }
  } else {
    this.d = new OrigDate();
  }
}

module.exports = exports = MockDate;
exports.OrigDate = OrigDate;

MockDate.prototype.calcTZO = function (ts) {
  var data = tzdata[timezone];
  assert.ok(data, 'Unsupported timezone: ' + timezone);
  ts = (ts || this.d.getTime()) / 1000;
  for (var ii = 2; ii < data.transitions.length; ii+=2) {
    if (data.transitions[ii] > ts) {
      return -data.transitions[ii-1];
    }
  }
  assert.ok(false, ts);
};

function passthrough(fn) {
  MockDate.prototype[fn] = function () {
    return this.d[fn].apply(this.d, arguments);
  };
}
function localGetter(fn) {
  MockDate.prototype[fn] = function () {
    var d = new OrigDate(this.d.getTime() - this.calcTZO() * 60 * 60 * 1000);
    return d['getUTC' + fn.slice(3)]();
  };
}
function localsetter(fn) {
  MockDate.prototype[fn] = function () {
    var d = new OrigDate(this.d.getTime() - this.calcTZO() * 60 * 60 * 1000);
    d['setUTC' + fn.slice(3)].apply(d, arguments);
    this.d.setTime(d.getTime() + this.calcTZO() * 60 * 60 * 1000);
  };
}
[
  'getUTCDate',
  'getUTCDay',
  'getUTCFullYear',
  'getUTCHours',
  'getUTCMilliseconds',
  'getUTCMinutes',
  'getUTCMonth',
  'getUTCSeconds',
  'getTime',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'toISOString',
  'toJSON',
  'toUTCString',
].forEach(passthrough);
[
  'getDate',
  'getDay',
  'getFullYear',
  'getHours',
  'getMilliseconds',
  'getMinutes',
  'getMonth',
  'getSeconds',
].forEach(localGetter);
[
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
].forEach(localsetter);

MockDate.prototype.getTimezoneOffset = function () {
  return this.calcTZO() * 60;
};

MockDate.prototype.toString = MockDate.prototype.toLocaleString = function () {
  return 'Mockday ' + this.d.toISOString() + ' GMT-0' + this.calcTZO() + '00 (MockDate)';
};

MockDate.now = Date.now;

// Unsupported:
// 'getYear',
// 'setYear',

// TODO:
// 'toDateString',
// 'toGMTString',
// 'toLocaleDateString',
// 'toLocaleTimeString',
// 'toTimeString',

function register(new_timezone) {
  if (new_timezone) {
    timezone = new_timezone;
  }
  global.Date = MockDate;
}
exports.register = register;

function unregister() {
  global.Date = OrigDate;
}
exports.unregister = unregister;
