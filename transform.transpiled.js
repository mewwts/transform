'use strict';

var _lodash = require('lodash');

module.exports = function (transforms, exclude) {

  return function (data) {
    if (!transforms && !exclude) return data;
    if (!transforms && exclude) return drop(data, exclude);

    if ((0, _lodash.isString)(transforms)) return select(data, [transforms]);

    if ((0, _lodash.isArray)(transforms)) return select(data, transforms);

    if ((0, _lodash.isString)(exclude)) exclude = [exclude];

    return (0, _lodash.map)(data, function (element) {
      return (0, _lodash.reduce)(element, function (acc, val, key) {
        var t = (0, _lodash.get)(transforms, key);
        if ((0, _lodash.isFunction)(t)) {
          var res = t(val);
          acc[res.key || key] = res.value || res;
        } else if ((0, _lodash.isString)(t)) {
          acc[t] = val;
        } else if ((0, _lodash.isPlainObject)(t)) {
          acc[key] = val;
        } else if ((0, _lodash.includes)(exclude, key) || exclude === true) {
          ;
        } else {
          acc[key] = val;
        }
        return acc;
      }, {});
    });
  };
};

function select(data, includeKeys) {
  return (0, _lodash.map)(data, function (obj) {
    return (0, _lodash.reduce)(includeKeys, function (acc, include) {
      acc = (0, _lodash.set)(acc, include, (0, _lodash.get)(obj, include));
      return acc;
    }, {});
  });
}

function drop(data, excludeKeys) {
  return (0, _lodash.map)(data, function (obj) {
    return (0, _lodash.omit)(obj, excludeKeys);
  });
}
