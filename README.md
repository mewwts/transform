# Transformer

var transformer = require('transformer');

transform(data, include, exclude)

//return a clone of the data object

transform(data);

//Cherry pick only x and y, omit everything else

transform(data, ['x', 'y'])

//Omit some keys
transform(data, null, ['x']]);
//alternatively
//omit(data, ['x']);

//transform x and y, leave out all other fields

transform(data, {'x': () => (), 'y': () => ()}, true);

//transform x and y, include all other fields

tranform(data, {'x': {}, 'y': {}});

// transform x and y, leave out z, include everything else

transform(data, ['x', 'y'], ['z'])

//move x to a new key z, include all other fields

transform(data, {'x': 'z'});

