import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/main.js',

  plugins: [
    json(),
    babel(babelrc()),
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
    }
  ]
};