import locals, { resetModifier } from './locals.js';
import display, { surface, unInitialize, initialize } from './display.js';
import event, { clearHandlers, eventIsOf, eventConsumer } from './event.js';
import { dud, notImplemented } from './shared.js';
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

// takes a a predicate and returns a function
// that returns a function that takes a consumer
// that returns a function that takes an event
// and calls the consumer when the event
function eventFilter(predicate) {
  return (consumer) => e => {
    if (predicate(e)) { consumer(e); }
  };
}

function addPygameEventListener(eventFilter, eventType, customListener) {
  // type => e => void
  let consumer = eventConsumer(eventType);
  // (e => void) => (e => void)
  let filteredConsumer = eventFilter(consumer);
  if (customListener) {
    customListener(filteredConsumer);
  } else {
    let listenerAdded = hasListener(eventType, consumer.name);
    if (!listenerAdded) {
      appendListener(eventType, consumer.name);
      globalScope.addEventListener(eventType, filteredConsumer);
    }
  }
}

function initializeHandlers(eventFilter, keydownListener, keyupListener) {
  addPygameEventListener(eventFilter, 'keyup', keyupListener);
  addPygameEventListener(eventFilter, 'keydown', keydownListener);
}

function displayBuilder(locs) {
  locs.display = makeModule(display(locs.Surface, globalScope));
  return locs;
}

export default {
  init(path, eventFilterPredicate, keydownListener, keyupListener) {

    let _efp = eventFilterPredicate || (() => true);

    initializeHandlers(eventFilter(_efp), keydownListener, keyupListener);

    Sk.externalLibraries = Sk.externalLibraries || {};

    Object.assign(Sk.externalLibraries, {
      './pygame/__init__.js': {
        path: `${path}/__init__.js`,
      },
      './pygame/locals.js"': {
        path: `${path}/locals.js`
      },
      './pygame/display.js': {
        path: `${path}/display.js`
      },
      './pygame/event.js': {
        path: `${path}/event.js`
      }
    });

    unInitialize();
  },
  main() {
    clearHandlers();
    resetModifier();
    return remapInner(
        displayBuilder(
          surface(
            assign({
              init() {
                initialize();
                return new Sk.builtin.tuple([6,0]);
              },
              quit: dud,

              error: notImplemented,
              get_error: notImplemented,
              set_error: notImplemented,
              get_sdl_version: notImplemented,
              get_sql_byteorder: notImplemented,
              register_quie: notImplemented,
              encode_string: notImplemented,
              encode_file_quit: notImplemented,

              locals: makeModule(locals),
              event: makeModule(event())
            }, locals)
          )
        )
      );
  },
  locals: remapInner(locals),
  display: remapInner(display),
  event: remapInner(event),
  Sk, eventIsOf
};