import locals from './locals.js';
import display from './display.js';
import event, { clearHandlers, eventIsOf, eventConsumer } from './event.js';
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

function addPygameEventListener(eventType, customListener) {
  if (customListener) {
    customListener(eventConsumer(eventType));
  } else {
    if (typeof(window) !== 'undefined') {
      let listeners = window.getEventListeners(window)[eventType];
      let hasListener = listeners && listeners.map(x => x.listener.name).indexOf('pygameEventListener') > -1;
      if (!hasListener) {
        window.addEventListener(eventType, eventConsumer(eventType));
      }
    }
  }
}

function initializeHandlers(keydownListener, keyupListener) {
  addPygameEventListener('keyup', keyupListener);
  addPygameEventListener('keydown', keydownListener);
}

let keydownListener = null;
let keyupListener = null;

export default {
  init(path, _keydownListener, _keyupListener) {

    initializeHandlers(keydownListener, keyupListener);

    keydownListener = _keydownListener;
    keyupListener = _keyupListener;

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
  Sk, eventIsOf
};