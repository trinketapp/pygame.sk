import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'test/tests.js',

  plugins: [
    json(),
    babel(babelrc()),
  ],
  external: external,
  targets: [
    {
      dest: 'pygame-tests.js',
      format: 'umd',
      moduleName: 'PygameTests',
    }
  ]
};