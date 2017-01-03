import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'pygame.sk',
  plugins: [ json(), babel() ],
  dest: 'bundle.js'
};  