import './eventtest.js';
import './displaytest.js';
import Sk from '../src/skulpt.js';
import { strictEqual } from './testhelper.js';
import { PygameError } from '../src/exceptions.js';

describe('pygame', () => {
  it('should have the correct repr of a pygame error', () => {
    var repr = Sk.ffi.remapToJs(Sk.builtin.str(new PygameError('yadda yadda')));
    strictEqual(repr, 'pygame.error: yadda yadda at <unknown>');
  });
});