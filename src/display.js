import { notImplemented, dud } from './shared.js';
import SurfaceClass from './surface.js';
import { PygameError } from './exceptions.js';
import Sk from './skulpt.js';

function surface(locs) {
  locs.Surface =  SurfaceClass(locs);
  locs.Surface.$isclass = true;
  return locs;
}

var initialized = false;

function throwIfNotInitialized() {
  if (!initialized) {
    throw new PygameError('video system not initialized');
  }
}

function initialize() {
  initialized = true;
}

function unInitialize() {
  initialized = false;
}

export { surface, initialize, unInitialize, throwIfNotInitialized };

export default function (Surface, globalScope) {
  return {
    __doc__: 'pygame module to control the display window and screen',
    __name__: 'pygame.display',
    __package__: Sk.builtin.none.none$,
    __PYGAMEinit__: notImplemented,

    quit: dud(Sk.builtin.none.none$),
    init() {
      initialize();
      return Sk.builtin.none.none$;
    },
    update: dud(Sk.builtin.none.none$),
    set_mode(size) {
      initialize();
      let lsize = size ? size : new Sk.builtin.tuple([globalScope.innerWidth, globalScope.innerHeight]);

      return Sk.misceval.callsim(Surface, lsize);
    },
    get_init: function() {
      return Sk.ffi.remapToPy(initialized);
    },

    get_caption: notImplemented,
    mode_ok: notImplemented,
    set_icon: notImplemented,
    get_active: notImplemented,
    iconify: notImplemented,
    set_gamma: notImplemented,
    set_palette: notImplemented,
    get_wm_info: notImplemented,
    set_gamma_ramp: notImplemented,
    Info: notImplemented,
    get_surface: notImplemented,
    toggle_fullscreen: notImplemented,
    get_driver: notImplemented,
    set_caption: notImplemented,
    flip: notImplemented,
    _PYGAME_C_API: notImplemented,
    gl_get_attribute: notImplemented,
    gl_set_attribute: notImplemented,
    list_modes: notImplemented,
  };
}