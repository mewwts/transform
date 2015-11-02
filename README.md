# Transform

`transform` operates on arrays of objects and lets you
- [x] cherry pick (nested) keys that your objects should include
- [x] define functions that transform values of a given key, and possibly alters the key as well.
- [x] map a value to a new key
- [x] omit keys from the objects.

Transform will hopefully in the future also be able to:
- [ ] omit nested keys from the objects.
- [ ] transform nested fields

## Usage
To install run
```npm install transform.js```,

and to use `transform` do

```js
var transform = require('transform.js');
```

Roughly speaking `transform` is a function that accepts two parameters

1. the fields that should be included, and/or mapped
2. the fields that should be ommited,

which that returns a function that accept a single parameter; a data array.

I think of it as 
```js
transform(include, exclude)(data)
```

## Behaviour

If the two parameters are ommited `transform` will return a function that will return a clone of the data object.
```js
var cloned = transform()(data);
```

If the the first parameter is a string or a list of keys, the given keys will be cherry picked from each object in the data array, and the second parameter will be ignored:
```js
transform(['x', 'y'])  // only keep fields 'x' and 'y'
transform('x') // only keep field 'x'
transform('x.x') // only keep 'x.x'
```

If the first parameter is falsy, and the second parameter is a string or list of keys, the given keys will be ommitted from each object in the data array. (Note: does not accept nested keys as of now)
```js
transform(null, ['x']])(d); //will remove the key x from the returned array
```

Now the interesting part begins. If the second parameter is an object, the behaviour changes slightly.

To transform the values of keys 'x' and 'y', but leave out all other fields do

```js
transform({
  x: (val) => val + 1, 
  y: (val) => val + 1
}, true)(data);
```

To transform the values of keys 'x' and 'y', but include all other fields do
```js
transform({
  x: (val) => val + 1, 
  y: (val) => val + 1
})(data);
```

To map a value to a new key (and include all other field) do
```js
transform({
  x: 'y',
  y: 'x'
})(data);
```
Or, if you need to both transform and map to a new key do
```js
transform({
  x: (val) => ({key: 'y', value: val + 1}),
  y: (val) => ({key: 'x', value: val + 1})
})(data);
```

The fact that transform returns a function is nifty, because in your app you can do stuff like saving different mappings for different types of objects.
```js
var threadMapping = transform(['threadName', 'commentIds'])
var commentMapping = transform({
  id: {},
  author: (val) => capitalize(val),
  comment: {}
})
```
Then you can use these mappings wherever you see fit.
```jsx
function thread() {
  return <Threads threads=threadMapping(threadsFromAPI) />
}
```





