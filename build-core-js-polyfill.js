const fs = require('fs');
const builder = require('core-js-builder');

builder({
  modules: ['es6.set'],
  umd: true
}).then(code => {
  fs.writeFileSync('core-js-set.js', code);
})