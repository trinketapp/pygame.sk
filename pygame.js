(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Pygame = factory());
}(this, (function () { 'use strict';

function notImplemented() {
  throw new Sk.builtin.NotImplementedError('this function is not implemented in Sklupt');
}

function dud() {
  return Sk.builtin.none.none$;
}

if (typeof require === 'function') {
  var fs = require('fs');
  var skulpt = fs.readFileSync('./skulpt.min.js').toString();
  (1, eval)(skulpt);
}

var init = function $__init__123$(self, type, dict) {
  Sk.builtin.pyCheckArgs('__init__', arguments, 2, 3, false, false);
  Sk.abstr.sattr(self, 'dict', dict ? dict : new Sk.builtin.dict(), false);
  Sk.abstr.sattr(self, 'type', type, false);
  return Sk.builtin.none.none$;
};
init.co_name = new Sk.builtins['str']('__init__');
init.co_varnames = ['self', 'type', 'dict'];

var repr = function $__repr__123$(self) {
  var dict = Sk.ffi.remapToJs(Sk.abstr.gattr(self, 'dict', false)['$r']());
  var type = Sk.ffi.remapToJs(Sk.abstr.gattr(self, 'type', false)['$r']());

  return Sk.ffi.remapToPy('<Event(' + type + '-' + reveseLookup(parseInt(type, 10)) + ' ' + dict + ')>');
};
repr.co_name = new Sk.builtins['str']('__repr__');
repr.co_varnames = ['self'];

var event$1 = function $EventType$class_outer(gbl, loc) {
  loc.__init__ = new Sk.builtins.function(init, gbl);
  loc.__repr__ = new Sk.builtins.function(repr, gbl);
  return;
};
event$1.co_name = new Sk.builtins['str']('Event');

var EventClass = function (gbl) {
  return Sk.misceval.buildClass(gbl, event$1, 'Event', []);
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var notifiers = [];
var queue = [];

var blackList = new Set();
var whiteList = new Set();

function eventConsumer(eventtype) {
  return function (event) {
    var pygameEvent = mapEvent(eventtype, event);
    var consumed = notifiers.reduce(function (l, r) {
      return l || r(pygameEvent);
    }, false);
    if (!consumed && isAllowed(pygameEvent)) {
      queue.push(pygameEvent);
    }
  };
}

var handler = function handler(fulfill, susp, consume) {
  return function (event) {
    susp.result = event;
    fulfill(event);
    return consume;
  };
};

var eventIsOf = function eventIsOf(e, types) {
  return types.indexOf(Sk.ffi.remapToJs(Sk.abstr.gattr(e, 'type', false))) !== -1;
};

var queueContains = function queueContains(types) {
  return !!queue.find(function (e) {
    return eventIsOf(e, types);
  });
};

function isAllowed(e) {
  if (whiteList.size > 0) {
    return eventIsOf(e, Array.from(whiteList));
  }

  if (blackList.size > 0) {
    return !eventIsOf(e, Array.from(blackList));
  }

  return true;
}

var event_locs = {
  '__package__': Sk.builtin.none.none$,
  '__doc__': 'pygame module for interacting with events and queues',
  '__name__': 'pygame.event',

  'get_grab': dud,
  'set_grab': dud,
  'pump': dud,

  poll: function poll() {
    return queue.length ? queue.pop() : Sk.misceval.callsimOrSuspend(event_locs.Event, Sk.ffi.remapToPy(0));
  },
  post: function post(event) {
    Sk.builtin.pyCheckArgs('post', arguments, 1, 1);
    if (isAllowed(event)) {
      queue.push(event);
    }
  },
  get: function get$$1(type) {
    if (type) {
      var _ret = function () {
        var types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];

        try {
          return {
            v: Sk.ffi.remapToPy(queue.filter(function (e) {
              return eventIsOf(e, types);
            }))
          };
        } finally {
          queue = queue.filter(function (e) {
            return !eventIsOf(e, types);
          });
        }
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    try {
      return Sk.ffi.remapToPy(queue);
    } finally {
      queue.length = 0;
    }
  },
  clear: function clear() {
    queue.length = 0;
    return Sk.builtin.none.none$;
  },
  peek: function peek(type) {
    if (type) {
      if (Sk.builtin.checkIterable(type)) {
        var types = Sk.ffi.remapToJs(type);
        return Sk.ffi.remapToPy(queueContains(types));
      }

      return Sk.ffi.remapToPy(queueContains([Sk.ffi.remapToJs(type)]));
    }

    return queue.length ? queue[0] : Sk.misceval.callsimOrSuspend(event_locs.Event, Sk.ffi.remapToPy(0));
  },
  wait: function wait() {
    var chandler = null;

    var susp = new Sk.misceval.Suspension();

    susp.data = {
      type: 'Sk.promise',
      promise: new Promise(function (fulfill) {
        chandler = handler(fulfill, susp, true);
        notifiers.push(chandler);
      })
    };

    susp.resume = function () {
      //remove handler when we're done waiting
      notifiers.splice(notifiers.indexOf(handler), 1);

      return susp.result;
    };

    return susp;
  },

  event_name: function event_name(type) {
    return Sk.ffi.remapToPy(reveseLookup(Sk.ffi.remapToJs(type)));
  },
  set_blocked: function set_blocked(type) {
    Sk.builtin.pyCheckArgs('set_blocked', arguments, 1, 1);
    var types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];
    types.forEach(function (t) {
      return blackList.add(t);
    });
    return Sk.builtin.none.none$;
  },
  set_allowed: function set_allowed(type) {
    Sk.builtin.pyCheckArgs('set_allowed', arguments, 1, 1);
    var types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];
    types.forEach(function (t) {
      return whiteList.add(t);
    });
    return Sk.builtin.none.none$;
  },
  get_blocked: function get_blocked(type) {
    Sk.builtin.pyCheckArgs('get_blocked', arguments, 1, 1);
    var jstype = Sk.ffi.remapToJs(type);
    return Sk.ffi.remapToPy(blackList.has(jstype));
  },


  'EventType': notImplemented,
  '_PYGAME_C_API': notImplemented
};

function clearHandlers() {
  notifiers.length = 0;
}

function event() {
  event_locs.Event = EventClass(event_locs);
  event_locs.Event.$isclass = true;
  return event_locs;
}

var locals = {
  '__doc__': 'Set of functions from PyGame that are handy to have in\nthe local namespace for your module',
  '__name__': 'pygame.locals',
  '__package__': 'pygame',

  'ACTIVEEVENT': 1,
  'ANYFORMAT': 268435456,
  'ASYNCBLIT': 4,
  'AUDIO_S16': 32784,
  'AUDIO_S16LSB': 32784,
  'AUDIO_S16MSB': 36880,
  'AUDIO_S16SYS': 32784,
  'AUDIO_S8': 32776,
  'AUDIO_U16': 16,
  'AUDIO_U16LSB': 16,
  'AUDIO_U16MSB': 4112,
  'AUDIO_U16SYS': 16,
  'AUDIO_U8': 8,
  'BIG_ENDIAN': 4321,
  'BLEND_ADD': 1,
  'BLEND_MAX': 5,
  'BLEND_MIN': 4,
  'BLEND_MULT': 3,
  'BLEND_PREMULTIPLIED': 17,
  'BLEND_RGBA_ADD': 6,
  'BLEND_RGBA_MAX': 16,
  'BLEND_RGBA_MIN': 9,
  'BLEND_RGBA_MULT': 8,
  'BLEND_RGBA_SUB': 7,
  'BLEND_RGB_ADD': 1,
  'BLEND_RGB_MAX': 5,
  'BLEND_RGB_MIN': 4,
  'BLEND_RGB_MULT': 3,
  'BLEND_RGB_SUB': 2,
  'BLEND_SUB': 2,
  'BUTTON_X1': 6,
  'BUTTON_X2': 7,
  'DOUBLEBUF': 1073741824,
  'FULLSCREEN': -2147483648,
  'GL_ACCELERATED_VISUAL': 15,
  'GL_ACCUM_ALPHA_SIZE': 11,
  'GL_ACCUM_BLUE_SIZE': 10,
  'GL_ACCUM_GREEN_SIZE': 9,
  'GL_ACCUM_RED_SIZE': 8,
  'GL_ALPHA_SIZE': 3,
  'GL_BLUE_SIZE': 2,
  'GL_BUFFER_SIZE': 4,
  'GL_DEPTH_SIZE': 6,
  'GL_DOUBLEBUFFER': 5,
  'GL_GREEN_SIZE': 1,
  'GL_MULTISAMPLEBUFFERS': 13,
  'GL_MULTISAMPLESAMPLES': 14,
  'GL_RED_SIZE': 0,
  'GL_STENCIL_SIZE': 7,
  'GL_STEREO': 12,
  'GL_SWAP_CONTROL': 16,
  'HAT_CENTERED': 0,
  'HAT_DOWN': 4,
  'HAT_LEFT': 8,
  'HAT_LEFTDOWN': 12,
  'HAT_LEFTUP': 9,
  'HAT_RIGHT': 2,
  'HAT_RIGHTDOWN': 6,
  'HAT_RIGHTUP': 3,
  'HAT_UP': 1,
  'HWACCEL': 256,
  'HWPALETTE': 536870912,
  'HWSURFACE': 1,
  'IYUV_OVERLAY': 1448433993,
  'JOYAXISMOTION': 7,
  'JOYBALLMOTION': 8,
  'JOYBUTTONDOWN': 10,
  'JOYBUTTONUP': 11,
  'JOYHATMOTION': 9,
  'KEYDOWN': 2,
  'KEYUP': 3,
  'KMOD_ALT': 768,
  'KMOD_CAPS': 8192,
  'KMOD_CTRL': 192,
  'KMOD_LALT': 256,
  'KMOD_LCTRL': 64,
  'KMOD_LMETA': 1024,
  'KMOD_LSHIFT': 1,
  'KMOD_META': 3072,
  'KMOD_MODE': 16384,
  'KMOD_NONE': 0,
  'KMOD_NUM': 4096,
  'KMOD_RALT': 512,
  'KMOD_RCTRL': 128,
  'KMOD_RMETA': 2048,
  'KMOD_RSHIFT': 2,
  'KMOD_SHIFT': 3,
  'K_0': 48,
  'K_1': 49,
  'K_2': 50,
  'K_3': 51,
  'K_4': 52,
  'K_5': 53,
  'K_6': 54,
  'K_7': 55,
  'K_8': 56,
  'K_9': 57,
  'K_AMPERSAND': 38,
  'K_ASTERISK': 42,
  'K_AT': 64,
  'K_BACKQUOTE': 96,
  'K_BACKSLASH': 92,
  'K_BACKSPACE': 8,
  'K_BREAK': 318,
  'K_CAPSLOCK': 301,
  'K_CARET': 94,
  'K_CLEAR': 12,
  'K_COLON': 58,
  'K_COMMA': 44,
  'K_DELETE': 127,
  'K_DOLLAR': 36,
  'K_DOWN': 274,
  'K_END': 279,
  'K_EQUALS': 61,
  'K_ESCAPE': 27,
  'K_EURO': 321,
  'K_EXCLAIM': 33,
  'K_F1': 282,
  'K_F10': 291,
  'K_F11': 292,
  'K_F12': 293,
  'K_F13': 294,
  'K_F14': 295,
  'K_F15': 296,
  'K_F2': 283,
  'K_F3': 284,
  'K_F4': 285,
  'K_F5': 286,
  'K_F6': 287,
  'K_F7': 288,
  'K_F8': 289,
  'K_F9': 290,
  'K_FIRST': 0,
  'K_GREATER': 62,
  'K_HASH': 35,
  'K_HELP': 315,
  'K_HOME': 278,
  'K_INSERT': 277,
  'K_KP0': 256,
  'K_KP1': 257,
  'K_KP2': 258,
  'K_KP3': 259,
  'K_KP4': 260,
  'K_KP5': 261,
  'K_KP6': 262,
  'K_KP7': 263,
  'K_KP8': 264,
  'K_KP9': 265,
  'K_KP_DIVIDE': 267,
  'K_KP_ENTER': 271,
  'K_KP_EQUALS': 272,
  'K_KP_MINUS': 269,
  'K_KP_MULTIPLY': 268,
  'K_KP_PERIOD': 266,
  'K_KP_PLUS': 270,
  'K_LALT': 308,
  'K_LAST': 323,
  'K_LCTRL': 306,
  'K_LEFT': 276,
  'K_LEFTBRACKET': 91,
  'K_LEFTPAREN': 40,
  'K_LESS': 60,
  'K_LMETA': 310,
  'K_LSHIFT': 304,
  'K_LSUPER': 311,
  'K_MENU': 319,
  'K_MINUS': 45,
  'K_MODE': 313,
  'K_NUMLOCK': 300,
  'K_PAGEDOWN': 281,
  'K_PAGEUP': 280,
  'K_PAUSE': 19,
  'K_PERIOD': 46,
  'K_PLUS': 43,
  'K_POWER': 320,
  'K_PRINT': 316,
  'K_QUESTION': 63,
  'K_QUOTE': 39,
  'K_QUOTEDBL': 34,
  'K_RALT': 307,
  'K_RCTRL': 305,
  'K_RETURN': 13,
  'K_RIGHT': 275,
  'K_RIGHTBRACKET': 93,
  'K_RIGHTPAREN': 41,
  'K_RMETA': 309,
  'K_RSHIFT': 303,
  'K_RSUPER': 312,
  'K_SCROLLOCK': 302,
  'K_SEMICOLON': 59,
  'K_SLASH': 47,
  'K_SPACE': 32,
  'K_SYSREQ': 317,
  'K_TAB': 9,
  'K_UNDERSCORE': 95,
  'K_UNKNOWN': 0,
  'K_UP': 273,
  'K_a': 97,
  'K_b': 98,
  'K_c': 99,
  'K_d': 100,
  'K_e': 101,
  'K_f': 102,
  'K_g': 103,
  'K_h': 104,
  'K_i': 105,
  'K_j': 106,
  'K_k': 107,
  'K_l': 108,
  'K_m': 109,
  'K_n': 110,
  'K_o': 111,
  'K_p': 112,
  'K_q': 113,
  'K_r': 114,
  'K_s': 115,
  'K_t': 116,
  'K_u': 117,
  'K_v': 118,
  'K_w': 119,
  'K_x': 120,
  'K_y': 121,
  'K_z': 122,
  'LIL_ENDIAN': 1234,
  'MOUSEBUTTONDOWN': 5,
  'MOUSEBUTTONUP': 6,
  'MOUSEMOTION': 4,
  'NOEVENT': 0,
  'NOFRAME': 32,
  'NUMEVENTS': 32,
  'OPENGL': 2,
  'OPENGLBLIT': 10,
  'PREALLOC': 16777216,
  'QUIT': 12,
  'RESIZABLE': 16,
  'RLEACCEL': 16384,
  'RLEACCELOK': 8192,
  'SCRAP_BMP': 'image/bmp',
  'SCRAP_CLIPBOARD': 0,
  'SCRAP_PBM': 'image/pbm',
  'SCRAP_PPM': 'image/ppm',
  'SCRAP_SELECTION': 1,
  'SCRAP_TEXT': 'text/plain',
  'SRCALPHA': 65536,
  'SRCCOLORKEY': 4096,
  'SWSURFACE': 0,
  'SYSWMEVENT': 13,
  'TIMER_RESOLUTION': 10,
  'USEREVENT': 24,
  'USEREVENT_DROPFILE': 4096,
  'UYVY_OVERLAY': 1498831189,
  'VIDEOEXPOSE': 17,
  'VIDEORESIZE': 16,
  'YUY2_OVERLAY': 844715353,
  'YV12_OVERLAY': 842094169,
  'YVYU_OVERLAY': 1431918169
};

var names = {
  0: 'NoEvent',
  1: 'ActiveEvent',
  2: 'KeyDown',
  3: 'KeyUp',
  4: 'MouseMotion',
  5: 'MouseButtonDown',
  6: 'MouseButtonUp',
  7: 'JoyAxisMotion',
  8: 'JoyBallMotion',
  9: 'JoyHatMotion',
  10: 'JoyButtonDown',
  11: 'JoyButtonUp',
  12: 'Quit',
  13: 'SysWMEvent',
  16: 'VideoResize',
  17: 'VideoExpose',
  24: 'UserEvent',
  27: 'UserEvent'
};

var typeMap = {
  'keyup': locals.KEYUP,
  'keydown': locals.KEYDOWN
};

var keyMap = {
  'AltLeft': locals.K_LALT,
  'AltRight': locals.K_RALT,
  'ControlLeft': locals.K_LCTRL,
  'ControlRight': locals.K_LCTRL,
  'MetaLeft': locals.K_LMETA,
  'MetaRight': locals.K_RMETA,
  'ShiftLeft': locals.K_LSHIFT,
  'ShiftRight': locals.K_RSHIFT,
  'CapsLock': locals.K_CAPSLOCK,
  'Escape': locals.K_ESCAPE,
  'F1': locals.K_F1,
  'F2': locals.K_F2,
  'F3': locals.K_F3,
  'F4': locals.K_F4,
  'F5': locals.K_F5,
  'F6': locals.K_F6,
  'F7': locals.K_F7,
  'F8': locals.K_F8,
  'F9': locals.K_F9,
  'F10': locals.K_F10,
  'F11': locals.K_F11,
  'F12': locals.K_F12,
  'ArrowUp': locals.K_UP,
  'ArrowLeft': locals.K_LEFT,
  'ArrowRight': locals.K_RIGHT,
  'ArrowDown': locals.K_DOWN,
  'Semicolon': locals.K_SEMICOLON,
  'Quote': locals.K_QUOTE,
  'BracketRight': locals.K_RIGHTBRACKET,
  'BracketLeft': locals.K_LEFTBRACKET,
  'Digit0': locals.K_0,
  'Digit1': locals.K_1,
  'Digit2': locals.K_2,
  'Digit3': locals.K_3,
  'Digit4': locals.K_4,
  'Digit5': locals.K_5,
  'Digit6': locals.K_6,
  'Digit7': locals.K_7,
  'Digit8': locals.K_8,
  'Digit9': locals.K_9,
  'Backspace': locals.K_BACKSPACE,
  'Enter': locals.K_RETURN,
  'Tab': locals.K_TAB,
  'Space': locals.K_SPACE,
  'Comma': locals.K_COMMA,
  'Period': locals.K_PERIOD,
  'Slash': locals.K_SLASH,
  'Backslash': locals.K_BACKSLASH,
  'IntlBackslash': locals.K_BACKQUOTE,
  'Minus': locals.K_MINUS,
  'Equals': locals.K_EQUALS,
  'KeyQ': locals.K_q,
  'KeyW': locals.K_w,
  'KeyE': locals.K_e,
  'KeyR': locals.K_r,
  'KeyT': locals.K_t,
  'KeyY': locals.K_y,
  'KeyU': locals.K_u,
  'KeyI': locals.K_i,
  'KeyO': locals.K_o,
  'KeyP': locals.K_p,
  'KeyA': locals.K_a,
  'KeyS': locals.K_s,
  'KeyD': locals.K_d,
  'KeyF': locals.K_f,
  'KeyG': locals.K_g,
  'KeyH': locals.K_h,
  'KeyJ': locals.K_j,
  'KeyK': locals.K_k,
  'KeyL': locals.K_l,
  'KeyZ': locals.K_z,
  'KeyX': locals.K_x,
  'KeyC': locals.K_c,
  'KeyV': locals.K_v,
  'KeyB': locals.K_b,
  'KeyN': locals.K_n,
  'KeyM': locals.K_m,

  //not mapped but with value
  'Backquote': 160
};

var scanCodeMap = {
  'KeyA': 0,
  'KeyS': 1,
  'KeyD': 2,
  'KeyF': 3,
  'KeyH': 4,
  'KeyG': 5,
  'KeyZ': 6,
  'KeyX': 7,
  'KeyC': 8,
  'KeyV': 9,
  'Backquote': 10,
  'KeyB': 11,
  'KeyQ': 12,
  'KeyW': 13,
  'KeyE': 14,
  'KeyR': 15,
  'KeyY': 16,
  'KeyT': 17,
  'Digit1': 18,
  'Digit2': 19,
  'Digit3': 20,
  'Digit4': 21,
  'Digit6': 22,
  'Digit5': 23,
  'Equals': 24,
  'Digit9': 25,
  'Digit7': 26,
  'Minus': 27,
  'Digit8': 28,
  'Digit0': 29,
  'BracketRight': 30,
  'KeyO': 31,
  'KeyU': 32,
  'BracketLeft': 33,
  'KeyI': 34,
  'KeyP': 35,
  'Enter': 36,
  'KeyL': 37,
  'KeyJ': 38,
  'Quote': 39,
  'KeyK': 40,
  'Semicolon': 41,
  'Backslash': 42,
  'Comma': 43,
  'Slash': 44,
  'KeyN': 45,
  'KeyM': 46,
  'Period': 47,
  'Tab': 48,
  'Space': 49,
  'IntlBackslash': 50,
  'Backspace': 51,
  'Escape': 53,
  'F5': 96,
  'F6': 97,
  'F7': 98,
  'F3': 99,
  'F8': 100,
  'F9': 101,
  'F10': 109,
  'F11': 110,
  'F12': 111,
  'F4': 118,
  'F2': 120,
  'F1': 122,
  'ArrowLeft': 123,
  'ArrowRight': 124,
  'ArrowDown': 125,
  'ArrowUp': 126
};

function reveseLookup(type) {
  var val = locals[Object.keys(locals).find(function (v) {
    return locals[v] === type;
  })];
  if (val && names.hasOwnProperty(val)) {
    return names[val];
  }

  return 'Unknown';
}

function mapEvent(eventtype, jsevent) {
  return Sk.misceval.callsimOrSuspend(event().Event, Sk.ffi.remapToPy(typeMap[eventtype]), Sk.ffi.remapToPy({
    unicode: jsevent.key.length === 1 ? jsevent.key : '',
    key: keyMap[jsevent.code],
    scancode: scanCodeMap[jsevent.code] || 0
  }));
}

var display = {
  __doc__: 'pygame module to control the display window and screen',
  __name__: 'pygame.display',
  __package__: Sk.builtin.none.none$,
  __PYGAMEinit__: notImplemented,

  quit: dud,
  init: dud,
  update: dud,

  get_caption: notImplemented,
  mode_ok: notImplemented,
  set_icon: notImplemented,
  get_active: notImplemented,
  iconify: notImplemented,
  set_gamma: notImplemented,
  set_palette: notImplemented,
  set_mode: notImplemented,
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
  list_modes: notImplemented
};

function remapInner(obj) {
  if (typeof obj === 'function') {
    return function () {
      return remapInner(obj());
    };
  } else {
    var res = {};
    for (var x in obj) {
      if (obj[x].$isclass) {
        res[x] = obj[x];
        delete res[x].$isclass;
      } else {
        res[x] = Sk.ffi.remapToPy(obj[x]);
      }
    }
  }

  return res;
}

function makeModule(locs) {
  var smodule = new Sk.builtin.module();
  smodule.$d = remapInner(locs);
  return smodule;
}

function assign(target, source) {
  var cleanSource = {};
  Object.keys(source).filter(function (x) {
    return x[0] !== '_';
  }).forEach(function (x) {
    return cleanSource[x] = source[x];
  });
  return Object.assign(target, cleanSource);
}

function initializeHandlers(keydownListener, keyupListener) {
  if (keydownListener) {
    keydownListener(eventConsumer('keydown'));
  } else {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', eventConsumer('keydown'));
    }
  }

  if (keyupListener) {
    keyupListener(eventConsumer('keyup'));
  } else {
    if (typeof window !== 'undefined') {
      window.addEventListener('keyup', eventConsumer('keyup'));
    }
  }
}

var keydownListener = null;
var keyupListener = null;

var main = {
  init: function init(path, _keydownListener, _keyupListener) {

    keydownListener = _keydownListener;
    keyupListener = _keyupListener;

    Sk.externalLibraries = Sk.externalLibraries || {};

    Object.assign(Sk.externalLibraries, {
      pygame: {
        path: path + '/__init__.js'
      },
      'pygame.locals': {
        path: path + '/locals.js'
      },
      'pygame.display': {
        path: path + '/display.js'
      },
      'pygame.event': {
        path: path + '/event.js'
      }
    });
  },
  main: function main() {
    clearHandlers();
    initializeHandlers(keydownListener, keyupListener);
    return remapInner(assign({
      init: function init() {
        //dud
      },

      display: makeModule(display),
      locals: makeModule(locals),
      event: makeModule(event())
    }, locals));
  },

  locals: remapInner(locals),
  display: remapInner(display),
  event: remapInner(event),
  Sk: Sk, eventIsOf: eventIsOf
};

return main;

})));