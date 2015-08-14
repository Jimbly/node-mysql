var assert = require('assert');
var OrigDate = Date;

var timezone = 'US/Pacific';

var HOUR = 60 * 60 * 1000;

var tzdata = {
  'UTC': {
    names: [0, 'UTC'],
    transitions: [0, 0, Infinity, 0],
  },
  'US/Pacific': {
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
    ],
  },
  'US/Eastern': {
    names: [-4, 'EDT', -5, 'EST'],
    transitions: [
      0, -5,
      9961200, -4,
      25682400, -5,
      41410800, -4,
      57736800, -5,
      73465200, -4,
      89186400, -5,
      104914800, -4,
      120636000, -5,
      126687600, -4,
      152085600, -5,
      162370800, -4,
      183535200, -5,
      199263600, -4,
      215589600, -5,
      230713200, -4,
      247039200, -5,
      262767600, -4,
      278488800, -5,
      294217200, -4,
      309938400, -5,
      325666800, -4,
      341388000, -5,
      357116400, -4,
      372837600, -5,
      388566000, -4,
      404892000, -5,
      420015600, -4,
      436341600, -5,
      452070000, -4,
      467791200, -5,
      483519600, -4,
      499240800, -5,
      514969200, -4,
      530690400, -5,
      544604400, -4,
      562140000, -5,
      576054000, -4,
      594194400, -5,
      607503600, -4,
      625644000, -5,
      638953200, -4,
      657093600, -5,
      671007600, -4,
      688543200, -5,
      702457200, -4,
      719992800, -5,
      733906800, -4,
      752047200, -5,
      765356400, -4,
      783496800, -5,
      796806000, -4,
      814946400, -5,
      828860400, -4,
      846396000, -5,
      860310000, -4,
      877845600, -5,
      891759600, -4,
      909295200, -5,
      923209200, -4,
      941349600, -5,
      954658800, -4,
      972799200, -5,
      986108400, -4,
      1004248800, -5,
      1018162800, -4,
      1035698400, -5,
      1049612400, -4,
      1067148000, -5,
      1081062000, -4,
      1099202400, -5,
      1112511600, -4,
      1130652000, -5,
      1143961200, -4,
      1162101600, -5,
      1173596400, -4,
      1194156000, -5,
      1205046000, -4,
      1225605600, -5,
      1236495600, -4,
      1257055200, -5,
      1268550000, -4,
      1289109600, -5,
      1299999600, -4,
      1320559200, -5,
      1331449200, -4,
      1352008800, -5,
      1362898800, -4,
      1383458400, -5,
      1394348400, -4,
      1414908000, -5,
      1425798000, -4,
      1446357600, -5,
      1457852400, -4,
      1478412000, -5,
      1489302000, -4,
      1509861600, -5,
      1520751600, -4,
      1541311200, -5,
      1552201200, -4,
      1572760800, -5,
      1583650800, -4,
      1604210400, -5,
      1615705200, -4,
      1636264800, -5,
      1647154800, -4,
      1667714400, -5,
      1678604400, -4,
      1699164000, -5,
      1710054000, -4,
      1730613600, -5,
      1741503600, -4,
      1762063200, -5,
      1772953200, -4,
      1793512800, -5,
      1805007600, -4,
      1825567200, -5,
      1836457200, -4,
      1857016800, -5,
      1867906800, -4,
      1888466400, -5,
      1899356400, -4,
      1919916000, -5,
      1930806000, -4,
      1951365600, -5,
      1962860400, -4,
      1983420000, -5,
      1994310000, -4,
      2014869600, -5,
      2025759600, -4,
      2046319200, -5,
      2057209200, -4,
      2077768800, -5,
      2088658800, -4,
      2109218400, -5,
      2120108400, -4,
      2140668000, -5,
    ],
  }
};

var date_iso_8601_regex=/^\d\d\d\d(-\d\d(-\d\d(T\d\d\:\d\d\:\d\d(\.\d\d\d)?Z?)?)?)?$/;
var date_with_offset=/^\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d(\.\d\d\d)? (Z|(\-|\+|)\d\d\:\d\d)$/;
var local_date_regex=/^\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d$/;

function MockDate(param) {
  assert.ok(arguments.length <= 1);
  if (arguments.length) {
    if (param instanceof MockDate) {
      this.d = new OrigDate(param.d);
    } else if (typeof param === 'string') {
      if (param.match(date_iso_8601_regex) || param.match(date_with_offset)) {
        this.d = new OrigDate(param);
      } else if (param.match(local_date_regex)) {
        this.d = new OrigDate();
        this.fromLocal(new OrigDate(param.replace(' ', 'T')));
      } else {
        assert.ok(false, 'Unhandled date format passed to MockDate constructor: ' + param);
      }
    } else if (typeof param === 'number') {
      this.d = new OrigDate(param);
    } else {
      assert.ok(false, 'Unhandled type passed to MockDate constructor: ' + typeof param);
    }
  } else {
    this.d = new OrigDate();
  }
}

module.exports = exports = MockDate;
exports.OrigDate = OrigDate;
exports.tzdata = tzdata;

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
function localgetter(fn) {
  MockDate.prototype[fn] = function () {
    var d = new OrigDate(this.d.getTime() - this.calcTZO() * HOUR);
    return d['getUTC' + fn.slice(3)]();
  };
}
MockDate.prototype.fromLocal = function(d) {
  // From a Date object in the fake-timezone where the returned UTC values are
  //   meant to be interpreted as local values.
  this.d.setTime(d.getTime() + this.calcTZO(d.getTime() + this.calcTZO(d.getTime()) * HOUR) * HOUR);
};
function localsetter(fn) {
  MockDate.prototype[fn] = function () {
    var d = new OrigDate(this.d.getTime() - this.calcTZO() * HOUR);
    d['setUTC' + fn.slice(3)].apply(d, arguments);
    this.fromLocal(d);
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
].forEach(localgetter);
[
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
].forEach(localsetter);

MockDate.prototype.getYear = function () {
  return this.getFullYear() - 1900;
};

MockDate.prototype.setYear = function (yr) {
  if (yr < 1900) {
    return this.setFullYear(1900 + yr);
  }
  return this.setFullYear(yr);
};

MockDate.prototype.getTimezoneOffset = function () {
  return this.calcTZO() * 60;
};

MockDate.prototype.toString = MockDate.prototype.toLocaleString = function () {
  if (this instanceof OrigDate) {
    // someone, like util.inspect, calling Date.prototype.toString.call(foo)
    return OrigDate.prototype.toString.call(this);
  }
  return 'Mockday ' + this.d.toISOString() + ' GMT-0' + this.calcTZO() + '00 (MockDate)';
};

MockDate.now = Date.now;

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
