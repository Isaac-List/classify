# classify

A node.js package for interaction with the Online Computer Library Center's
experimental classification web service,
[classify2](http://classify.oclc.org/classify2/).

[![NPM version](https://badge.fury.io/js/classify2_api.png)](http://badge.fury.io/js/classify2_api)

## Usage
```js
const classify = require('classify2_api');

// Using an ISBN -- will return a single result
classify.classify("isbn", ["9781491946008"], async function (data) {
  console.log(data.title);
  console.log(data.author);
  console.log(data.congress);
  console.log(data.dewey);
}

// Searching by title and author -- Will return a list of results
classify.classify("title-author", ["Fluent Python", "Luciano Ramalho"], async function (data) {
  console.log(data[0]);
}

// Searching using OCLC's "wi" code -- will return a single result
// Use to get information about a specific work when the module returns multiple results
classify.classify("wi", ["49261060"], async function (data) {
  console.log(data).title);
  console.log(data.author);
  console.log(data.congress);
  console.log(data.dewey);
})
```

## Response format

### ISBN

Given an ISBN number, the Classify module will attempt to return a single item response.

This response will be in the format:
```js
response = {
  status: OCLC Status Code,
  owi: OCLC "owi" identifier number,
  author: Author(s) of the work,
  title: Title of the work,
  dewey: Dewey Decimal number most commonly used,
  congress: Library of Congress Classification number most commonly used
}
```

### Title and/or Author

Given an list containing a title and/or an author, the Classify module will likely
return a muilt-result response. This response will include any works with the "Book"
format which match the search parameter(s) given.

This response will be in the format:
```js
response = [
  {
    author: Author(s) of the work,
    title: Title of the work,
    format: Format of the work (always "Book"),
    code: OCLC "wi" code of the work
  }
  ... other works in the same format
]
```

[![NPM](https://nodei.co/npm/classify2_api.png)](https://nodei.co/npm/classify2_api/)
