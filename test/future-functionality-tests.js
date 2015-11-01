'use strict';

require('babel-core/register');
var transform = require('../src/transform');
var test = require('tape');
var _ = require('lodash');

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
