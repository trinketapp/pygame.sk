const fs = require('fs');
const uglify = require('uglify-js');
const builder = require('core-js-builder');

builder({
  modules: ['es6', 'core.set'],
  umd: true
}).then(code => {
  let mincode = uglify.minify(code, {fromString: true});
  fs.writeFileSync('core-js-set.js', mincode.code);
})