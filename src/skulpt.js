/* global Sk */

if (typeof(require) === 'function') {
  var fs = require('fs');
  var skulpt = fs.readFileSync('bower_components/skulpt/skulpt.min.js').toString();
  (1, eval)(skulpt);
}

export default Sk;
