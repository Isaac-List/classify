# classify

A node.js package for interaction with the Online Computer Library Center's
experimental classification web service,
[classify2](http://classify.oclc.org/classify2/).

## Usage (Needs Updating)
```js
var classify = require( 'classify2' )
console.log( 'Dewey Decimal: ' + classify.get( '020161586X' ).dewey )
console.log( 'Library of Congress: ' + classify.get( '020161586X' ).congress )
console.log( 'Response: ' + classify.get( '020161586X' ).status )
```
