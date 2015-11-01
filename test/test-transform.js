'use strict';

require('babel-core/register');
var transform = require('../src/transform');
var test = require('tape');
var _ = require('lodash');

var obj1 = {
  id: 'id1',
  val1: 2,
  val2: 'my other string is cool',
  val3: {
    val3: 'coolness'
  }
}

var obj2 = {
  id: 'id2',
  val1: 3,
  val2: 'id2 is so nice',
  val3: {
    val3: 'super'
  }
}
var data = [obj1, obj2];

test('Transform should return the data object when no columns are specified', function (t) {
  var result = transform(data); // last parameters is falsy
  t.equal(result, data);
  t.end();
});

test('Transform should return a clone of the data object when all columns are specified as an array', function (t) {
  var result = transform(data, ['id', 'val1', 'val2', 'val3']);
  t.deepEqual(result, data);
  t.end();
});

test('Transform should be able to get and set nested objects through a list', function (t) {
  var key = 'val3.val3';
  var result = transform([obj1], [key]);
  t.deepEqual(result, [{val3: {val3: 'coolness'}}]);
  t.end();
});

test('Transform should omit and include when arguments are arrays', function (t) {
  var result = transform([obj1], ['val1']);
  t.deepEqual(result, [_.pick(obj1, 'val1')]);
  t.end();
});


test('Transform should omit fields when they are specified in the third arguments', function (t) {
  var result = transform([obj1], null, ['val3']);
  t.deepEqual(result, [_.omit(obj1, ['val3'])]);
  t.end();
});

test('Transform should be able to get and set nested objects through an array', function (t) {
  var result = transform(data, ['val3.val3']);
  t.deepEqual(result, [{val3: {val3: 'coolness'}}, {val3: {val3: 'super'}}]);
  t.end();
});

test('Transform should return a clone of the data object when columns are specified without a transform', function (t) {
  var result = transform(data, {
    id: {},
    val1: {},
    val2: {},
    val3: {}
  });
  t.deepEqual(result, data);
  t.end();
});

test('Transform should transform a value when given a function and exclude others when last param is true', function (t) {
  var result = transform(data, {
    val1: (val) => val + 1 
  }, true);
  t.deepEqual(result, [{val1: obj1.val1 + 1}, {val1: obj2.val1 + 1}]);
  t.end();
});

test('Transform should include other fields when last param is falsy ', function (t) {
  var result = transform(data, {
    val1: (val) => val + 1 
  });
  var clone = _.cloneDeep(data);
  clone[0].val1 += 1;
  clone[1].val1 += 1;
  t.deepEqual(result, clone);
  t.end();
});

test('Transform should exclude some fields', function (t) {
  var result = transform(data, {
    val1: (val) => val + 1 
  }, 'val3');

  var clone = _.cloneDeep(data);
  clone[0].val1 += 1;
  clone[1].val1 += 1;
  delete clone[0].val3;
  delete clone[1].val3;
  t.deepEqual(result, clone);
  t.end();
});

test('Transform should include all fields but ommited even when transforms are given', function (t) {
  var d = [{'x': 1, 'y': 2, 'z': 3}, {'x': 2, 'y': 3, 'z': 4}]
  var result = transform(d, {x: {}}, ['z']);
  t.deepEqual(result, [{'x': 1, 'y': 2}, {'x': 2, 'y': 3}]);
  t.end();
});

test('Transform should allow setting a new key', function (t) {
  var d = [{'x': 1, 'y': 2}]
  var result = transform(d, {x: 'y', y: 'x'});
  t.deepEqual(result, [{'y': 1, 'x': 2}]);
  t.end();
});

test('Transform should allow setting a new key while transforming', function (t) {
  var d = [{'x': 1, 'y': 2}]
  var result = transform(d, {
    x: (val) => ({key: 'y', value: val}),
    y: (val) => ({key: 'x', value: val})
  });
  t.deepEqual(result, [{'y': 1, 'x': 2}]);
  t.end();
});

test('Transform should allow transforming nested fields', function (t) {
  var d = [{x: {y: 2015}}, {x: {y: 2016}}];
  var result = transform(d, {
    'x.y': (val) => val + 1
  });
  var c = _.cloneDeep(d);
  c[0].x.y += 1;
  c[1].x.y += 1;
  t.deepEqual(result, c);
  t.end();
});
