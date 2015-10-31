# Transform

`transform` operates on arrays of objects and lets you
- [x] cherry pick (nested) keys that your objects should include
- [x] define functions that transform values of a given key, and possibly alters the key as well.
- [x] map a value to a new key
- [x] omit keys from the objects.

Transform will hopefully in the future also be able to:
- [ ] omit nested keys from the objects.

## Usage
To install run
```npm install transform.js```,

and to use `transform` do

```js
var transform = require('transform.js');
```

Roughly speaking `transform` is a function that accepts three parameters

1. the data array
2. the fields that should be included, and/or mapped
3. the fields that should be ommited. 

I think of it as 
```js
transform(data, include, exclude)
```

## Behaviour

If the last two parameters are ommited `transform` will return a clone of the data object.
```js
var cloned = transform(data);
```

If the the second parameter is a string or a list of keys, the given keys will be cherry picked from each object in the data array,
and the third parameter will be ignored:
```js
transform(data, ['x', 'y'])  // only keep fields 'x' and 'y'
transform(data, 'x') // only keep field 'x'
transform(data, 'x.x') // only keep 'x.x'
```

If the second parameter is falsy, and the third parameter is a string or list of keys, the given keys will be ommitted from each object in the data array. (Note: does not accept nested keys as of now)
```js
transform(data, null, ['x']]);
```

Now the interesting part begins. If the second parameter is an object, the behaviour changes a bit.

To transform the values of keys 'x' and 'y', but leave out all other fields do

```js
transform(data, {
  x: (val) => val + 1, 
  y: (val) => val + 1
}, true);
```

To transform the values of keys 'x' and 'y', but include all other fields do
```js
transform(data, {
  x: (val) => val + 1, 
  y: (val) => val + 1
});
```

To map a value to a new key (and include all other field) do
```js
transform(data, {
  x: 'y',
  y: 'x'
});
```
Or, if you need to both transform and map to a new key do
```js
transform(data, {
  x: (val) => ({key: 'y', value: val + 1}),
  y: (val) => ({key: 'x', value: val + 1})
});
```



