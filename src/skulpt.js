if (typeof(require) === 'function') {
  var fs = require('fs');
  var skulpt = fs.readFileSync('./skulpt.min.js').toString();
  (1, eval)(skulpt);
}

export default Sk;
