import Sk from './skulpt.js';
import { PygameError } from './exceptions.js';

// Surface((width, height), flags=0, depth=0, masks=None) -> Surface
// Surface((width, height), flags=0, Surface) -> Surface

var init = (function $__init__123$(self, size) {
  Sk.builtin.pyCheckArgs('__init__', arguments, 2, 5, false, false);

  [ self.width, self.height ] = Sk.ffi.remapToJs(size);

  if (self.width < 0 || self.height < 0) {
    throw new PygameError('Invalid resolution for Surface');
  }

  // ignoring other args.
  return Sk.builtin.none.none$;
});
init.co_name = new Sk.builtins['str']('__init__');
init.co_varnames = ['self', 'size', 'flags', 'depth', 'masks'];
init.$defaults = [ new Sk.builtin.int_(0), new Sk.builtin.int_(0), Sk.builtin.none.none$ ];

var repr = (function $__repr__123$(self){
  let width = Sk.ffi.remapToJs(self.width);
  let height = Sk.ffi.remapToJs(self.height);

  return Sk.ffi.remapToPy(`<Surface(${width}x${height}x32 SW)>`);
});
repr.co_name = new Sk.builtins['str']('__repr__');
repr.co_varnames = ['self'];

function get_height(self) {
  Sk.builtin.pyCheckArgs('get_height', arguments, 1, 1, false, false);

  return self.height;
}
get_height.co_name = new Sk.builtins['str']('get_height');
get_height.co_varnames = ['self'];

function get_width(self) {
  Sk.builtin.pyCheckArgs('get_width', arguments, 1, 1, false, false);

  return self.width;
}
get_width.co_name = new Sk.builtins['str']('get_width');
get_width.co_varnames = ['self'];

function get_size(self) {
  Sk.builtin.pyCheckArgs('get_size', arguments, 1, 1, false, false);

  return Sk.builtin.tuple([self.width, self.height]);
}
get_size.co_name = new Sk.builtins['str']('get_size');
get_size.co_varnames = ['self'];

function get_flags() {
  Sk.builtin.pyCheckArgs('get_flags', arguments, 1, 1, false, false);

  return new Sk.builtin.int_(0);
}
get_flags.co_name = new Sk.builtins['str']('get_flags');
get_flags.co_varnames = ['self'];

var surface = (function $Surface$class_outer(gbl, loc) {
  loc.__init__ = new Sk.builtins.function(init, gbl);
  loc.__repr__ = new Sk.builtins.function(repr, gbl);

  loc.get_width = new Sk.builtins.function(get_width, gbl);
  loc.get_height = new Sk.builtins.function(get_width, gbl);
  loc.get_size = new Sk.builtins.function(get_size, gbl);
  loc.get_flags = new Sk.builtins.function(get_flags, gbl);

  return;
});

surface.co_name = new Sk.builtins['str']('Surface');

export default function (gbl) {
  return Sk.misceval.buildClass(gbl, surface, 'Surface', []);
}