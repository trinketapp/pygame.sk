import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/main.js',

  plugins: [
    json(),
    babel(babelrc()),
    commonjs({
      include: 'node_modules/core-js/**'
    })
  ],
  external: external,
  targets: [
    {
      dest: 'pygame.js',
      format: 'umd',
      moduleName: 'Pygame',
    },
    {
      dest: pkg.module,
      format: 'es',
      //sourceMap: true
    }
  ]
};