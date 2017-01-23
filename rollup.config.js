import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'Pygame',
  plugins: [ json(), babel() ],
  dest: 'pygame.js'
};