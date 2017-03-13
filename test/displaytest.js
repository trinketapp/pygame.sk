import main from '../src/main.js';
import Sk from '../src/skulpt.js';
import displayMod, { unInitialize, throwIfNotInitialized, initialize } from '../src/display.js';
import { strictEqual } from './testhelper.js';

Sk.configure({ output: () => {} });
Sk.doOneTimeInitialization();

const pygame = main.main();
const display = displayMod(pygame.Surface, {
  innerWidth: 1,
  innerHeight: 2
});

describe('display', () => {

  beforeEach(() => {
    unInitialize();
  });

  it('should return a Surface when set_mode is called and it should have the right size', () => {
    let res = display.set_mode(Sk.ffi.remapToPy([1,2]));
    strictEqual(res.tp$name, 'Surface');
    strictEqual(res.width, 1);
    strictEqual(res.height, 2);
  });

  it('should return a Surface when set_mode is called and it should have a default size', () => {
    let res = display.set_mode();
    strictEqual(res.tp$name, 'Surface');
    strictEqual(res.width, 1);
    strictEqual(res.height, 2);
  });

  it('should return the correct value for get_init', () => {
    strictEqual(Sk.ffi.remapToJs(display.get_init()), false);
    initialize();
    strictEqual(Sk.ffi.remapToJs(display.get_init()), true);
  });

  it('should have initialized events after set_mode', () => {
    display.set_mode(Sk.ffi.remapToPy([1,1]));
    throwIfNotInitialized();
  });

  describe('surface - class', () => {
    it('should be initializable', () => {
      Sk.misceval.callsim(pygame.Surface, Sk.builtin.tuple([1,1]));
    });

    it('should have the correct __repr__', () => {
      let surface = Sk.misceval.callsim(pygame.Surface, Sk.builtin.tuple([1,2]));
      let res = Sk.ffi.remapToJs(Sk.misceval.callsim(surface.__repr__, surface));
      strictEqual(res, '<Surface(1x2x32 SW)>');
    });

    it('should have a get_width and a get_height function', () => {
      let surface = Sk.misceval.callsim(pygame.Surface, Sk.builtin.tuple([1,2]));
      let width = Sk.ffi.remapToJs(Sk.misceval.callsim(surface.get_width, surface));
      let height = Sk.ffi.remapToJs(Sk.misceval.callsim(surface.get_height, surface));
      strictEqual(width, 1);
      strictEqual(height, 2);
    });

    it('should have a get_size function',() => {
      let surface = Sk.misceval.callsim(pygame.Surface, Sk.builtin.tuple([1,2]));
      let size = Sk.misceval.callsim(surface.get_size, surface);
      let jsize = Sk.ffi.remapToJs(size);
      let [ width, height ] = jsize;
      strictEqual(size.tp$name, 'tuple');
      strictEqual(jsize.length, 2);
      strictEqual(width, 1);
      strictEqual(height, 2);
    });
  });
});