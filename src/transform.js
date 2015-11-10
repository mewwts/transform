'use strict';
import {map, reduce, keys, union, get, set, includes, omit, pick,
        isFunction, isArray, isString, isPlainObject} from 'lodash';

module.exports = function (transforms, exclude) {
 
  return function (data) {
    if (!transforms && !exclude) 
      return data;
    if (!transforms && exclude)
      return drop(data, exclude);
    
    if (isString(transforms))
      return select(data, [transforms]);

    if (isArray(transforms))
      return select(data, transforms);

    if (isString(exclude))
      exclude = [exclude];

    return map(data, function (element) {
      return reduce(element, function (acc, val, key) { 
        var t = get(transforms, key);
        if (isFunction(t)) {
          let res = t(val);
          acc[res.key || key] = res.value || res;
        } else if (isString(t)) {
          acc[t] = val;
        } else if (isPlainObject(t)) {
          acc[key] = val;
        } else if (includes(exclude, key) || exclude === true) {
          ;
        } else {
          acc[key] = val;
        }
        return acc;
      }, {});
    });
  }
}

function select(data, includeKeys) {
  return map(data, function (obj) {
    return reduce(includeKeys, function (acc, include) {
      acc = set(acc, include, get(obj, include));
      return acc;
    }, {});
  });
}

function drop(data, excludeKeys) {
  return map(data, (obj) => omit(obj, excludeKeys));
}

