import { notImplemented, dud } from './shared.js';
import { initialize } from './event.js';
import SurfaceClass from './surface.js';
import Sk from './skulpt.js';

function surface(locs) {
  locs.Surface =  SurfaceClass(locs);
  locs.Surface.$isclass = true;
  return locs;
}

export { surface };

export default function (Surface) {
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
      return Sk.misceval.callsim(Surface, size);
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
    get_init: notImplemented,
    flip: notImplemented,
    _PYGAME_C_API: notImplemented,
    gl_get_attribute: notImplemented,
    gl_set_attribute: notImplemented,
    list_modes: notImplemented,
  };
}