# classify

A node.js package for interaction with the Online Computer Library Center's
experimental classification web service,
[classify2](http://classify.oclc.org/classify2/).

[![NPM version](https://badge.fury.io/js/classify2_api.png)](http://badge.fury.io/js/classify2_api)

## Usage
```js
const classify = require('classify2_api');

// Parameters: identifier, type, callback
// Type: "isbn" or "title-author"

classify.classify("isbn", ["9781491946008"], async function (data) {
  console.log(data.title);
  console.log(data.author);
  console.log(data.congress);
  console.log(data.dewey);
}

classify.classify("isbn", ["Fluent Python", "Luciano Ramalho"], async function (data) {
  console.log(data.title);
  console.log(data.author);
  console.log(data.congress);
  console.log(data.dewey);
}
```

[![NPM](https://nodei.co/npm/classify2_api.png)](https://nodei.co/npm/classify2_api/)
