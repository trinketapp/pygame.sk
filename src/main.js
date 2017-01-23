import locals from './locals.js'
import display from './display.js'
import event from './event.js'

Sk.externalLibraries = Sk.externalLibraries || {};

Object.assign(Sk.externalLibraries, {
  pygame: {
    path: '../../../pygame.sk/skulpt_module/__init__.js',
    dependencies: [
      '../../../pygame.sk/pygame.js'
    ]
  },
  "pygame.locals": {
    path: '../../../pygame.sk/skulpt_module/locals.js'
  },
  "pygame.display": {
    path: '../../../pygame.sk/skulpt_module/display.js'
  },
  "pygame.event": {
    path: '../../../pygame.sk/skulpt_module/event.js'
  }
});

function remapInner(obj) {
  var res = {};
  for (var x in obj) {
    res[x] = Sk.ffi.remapToPy(obj[x]);
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
  Object.keys(source).filter(x => x[0] !== "_").forEach(x => cleanSource[x] = source[x]);
  return Object.assign(target, cleanSource);
}

export default {
  main(name) {
    return remapInner(assign({
      init() {
        //dud
      },
      display: makeModule(display),
      locals: makeModule(locals),
      event: makeModule(event)
    }, locals));
  },
  locals: remapInner(locals),
  display: remapInner(display),
  event: remapInner(event)
};