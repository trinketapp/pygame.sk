import locals, { resetModifier } from './locals.js';
import display from './display.js';
import event, { clearHandlers, eventIsOf, eventConsumer } from './event.js';
import Sk from './skulpt.js';

const globalScope = typeof(window) !== 'undefined' ? window : global;

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

function appendListener(eventType, listenerName) {
  globalScope.listeners = globalScope.listeners || {};
  globalScope.listeners[eventType] = globalScope.listeners[eventType] || [];
  globalScope.listeners[eventType].push(listenerName);
}

const hasListener = (eventType, listenerName) => {
  let res = globalScope.listeners && globalScope.listeners[eventType] && globalScope.listeners[eventType].indexOf(listenerName) > -1;
  return res;
};

function addPygameEventListener(eventType, customListener) {
  if (customListener) {
    customListener(eventConsumer(eventType));
  } else {
    let listener = eventConsumer(eventType);
    let listenerAdded = hasListener(eventType, listener.name);
    if (!listenerAdded) {
      appendListener(eventType, listener.name);
      globalScope.addEventListener(eventType, listener);
    }
  }
}

function initializeHandlers(keydownListener, keyupListener) {
  addPygameEventListener('keyup', keyupListener);
  addPygameEventListener('keydown', keydownListener);
}

export default {
  init(path, keydownListener, keyupListener) {

    initializeHandlers(keydownListener, keyupListener);

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
    resetModifier();
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