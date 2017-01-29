import locals from './locals.js';
import display from './display.js';
import event, { clearHandlers, eventIsOf } from './event.js';
import Sk from './skulpt.js';

function remapInner(obj) {
  if (typeof(obj) === 'function') {
    return () => {
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

  console.log(res);
  return res;
}

function makeModule(locs) {
  var smodule = new Sk.builtin.module();
  smodule.$d = remapInner(locs);
  return smodule;
}

function assign(target, source) {
  var cleanSource = {};
  Object.keys(source).filter(x => x[0] !== '_').forEach(x => cleanSource[x] = source[x]);
  return Object.assign(target, cleanSource);
}

export default {
  init(path) {
    //because we make a class before skulpt is initialized
    //Sk.builtin.type.basesStr_ = new Sk.builtin.str("__bases__");

    Sk.externalLibraries = Sk.externalLibraries || {};

    Object.assign(Sk.externalLibraries, {
      pygame: {
        path:`${path}/__init__.js`,
      },
      'pygame.locals': {
        path: `${path}/locals.js`
      },
      'pygame.display': {
        path: `${path}/display.js`
      },
      'pygame.event': {
        path: `${path}/event.js`
      }
    });
  },
  main() {
    clearHandlers();
    return remapInner(assign({
      init() {
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
  Sk,
  eventIsOf,
};