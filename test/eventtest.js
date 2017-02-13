import event, { eventIsOf } from '../src/event.js';
import main from '../src/main.js';
import Sk from '../src/skulpt.js';

function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Expected: ${expected} actual: ${actual} ${message || ''}`);
  }
}

Sk.configure({ output: () => {} });
Sk.doOneTimeInitialization();

const globalScope = typeof(window) !== 'undefined' ? window : global;
const eventClass = event();
const init = main.init;

if (!globalScope.addEventListener) globalScope.addEventListener = function () {};
globalScope.listeners = {};

describe('event', () => {

  describe('event class', () => {

    it('__getattr__ implementation in eventclass', () => {
      let e = Sk.misceval.callsim(eventClass.Event, Sk.ffi.remapToPy(2), Sk.ffi.remapToPy({ 'key': 45 }));
      strictEqual(Sk.ffi.remapToJs(Sk.abstr.gattr(e, 'key')), 45);
    });

    it('should have the correct __repr__', () => {
      let e = Sk.misceval.callsim(eventClass.Event, Sk.ffi.remapToPy(2), Sk.ffi.remapToPy({ 'key': 45 }));
      let repr = Sk.abstr.gattr(e, '__repr__');
      strictEqual(Sk.ffi.remapToJs(Sk.misceval.callsim(repr)), '<Event(2-KeyDown {\'key\': 45})>');
    });

  });

  describe('isEventOf', () => {

    it('should not match if the event is not of type', () => {
      strictEqual(eventIsOf(Sk.misceval.callsim(eventClass.Event, 2), [1]), false);
    });

    it('should match if the event is of type', () => {
      strictEqual(eventIsOf(Sk.misceval.callsim(eventClass.Event, 2), [2]), true);
    });

  });

  describe('eventname', () => {

    it('should return the name of an eventtype', () => {
      strictEqual(Sk.misceval.callsim(eventClass.event_name, Sk.ffi.remapToPy(2)), Sk.ffi.remapToPy('KeyDown'));
    });

  });

  describe('javascript interface event listeners', () => {

    it('should add the default listeners to global scope when initialized', () => {
      init('');

      strictEqual(globalScope.listeners['keyup'].length, 1);
      strictEqual(globalScope.listeners['keydown'].length, 1);
    });

    it('shouldn\'t add the default listeners twice', () => {
      init('');
      init('');

      strictEqual(globalScope.listeners['keyup'].length, 1);
      strictEqual(globalScope.listeners['keydown'].length, 1);
    });

    it('should filter events based on the predicate', () => {
      let keyDown;
      init('', e => e.key == 'b', e => keyDown = e);

      keyDown({ code: 'KeyA', key: 'a', getModifierState() { return true; }});
      keyDown({ code: 'KeyB', key: 'b', getModifierState() { return true; }});

      let events = Sk.ffi.remapToJs(Sk.misceval.callsim(eventClass.get));

      strictEqual(events.length, 1);
    });
  });

  describe('modifier tests', () => {

    it('should add the capslock modifier when it\'s on', () => {
      let keyDown;
      init('', null, (eventHandler) => { keyDown = eventHandler; },  () => { });

      keyDown({ code: 'KeyA', key: 'a', getModifierState() { return true; } });
      let dict = Sk.ffi.remapToJs(Sk.abstr.gattr(Sk.misceval.callsim(eventClass.poll), 'dict', false));
      strictEqual(dict.mod, 8192);
    });

    it('should add the shift modifier when it\'s held', () => {
      let keyDown;
      init('', null, (eventHandler) => { keyDown = eventHandler; }, () => { });

      keyDown({ code: 'ShiftLeft', key: '', getModifierState() { return false; } });
      keyDown({ code: 'KeyA', key: 'A', getModifierState() { return false; } });
      let dict = Sk.ffi.remapToJs(Sk.abstr.gattr(Sk.misceval.callsim(eventClass.poll), 'dict', false));

      strictEqual(dict.mod, 1);

      // empty queue for next tests
      Sk.misceval.callsim(eventClass.get);
    });

  });

  describe('queue functions', () => {

    it('should return an unknown event when the queue is empty on poll', () => {
      let event = Sk.misceval.callsim(eventClass.poll);
      strictEqual(eventIsOf(event, [0]), true);
    });

    it('should return an unknown event when the queue is empty on peek', () => {
      let event = Sk.misceval.callsim(eventClass.peek);
      strictEqual(eventIsOf(event, [0]), true);
    });

    it('should return a bool if an event of type is on the queue or not', () => {
      let event = Sk.misceval.callsim(eventClass.Event, 2);
      Sk.misceval.callsim(eventClass.post, event);

      let result = Sk.misceval.callsim(eventClass.peek, Sk.ffi.remapToPy(2));
      strictEqual(Sk.ffi.remapToJs(result), true);

      result = Sk.misceval.callsim(eventClass.peek, Sk.ffi.remapToPy(3));
      strictEqual(Sk.ffi.remapToJs(result), false);
    });

    it('should be able to post an event on the queue', () => {
      let event = Sk.misceval.callsim(eventClass.Event, 2);
      Sk.misceval.callsim(eventClass.post, event);

      strictEqual(Sk.misceval.callsim(eventClass.poll), event);
    });

    it('should get all events on queue of type', () => {
      let events = [
        Sk.misceval.callsim(eventClass.Event, 2),
        Sk.misceval.callsim(eventClass.Event, 3),
        Sk.misceval.callsim(eventClass.Event, 4) ];

      events.forEach(e => Sk.misceval.callsim(eventClass.post, e));

      strictEqual(eventIsOf(Sk.misceval.callsim(eventClass.get, Sk.ffi.remapToPy(2)).v[0], [2]), true);
      strictEqual(eventIsOf(Sk.misceval.callsim(eventClass.get, Sk.ffi.remapToPy(3)).v[0], [3]), true);
      strictEqual(eventIsOf(Sk.misceval.callsim(eventClass.get, Sk.ffi.remapToPy(4)).v[0], [4]), true);
    });

    it('should get all events on queue', () => {
      let events = [
        Sk.misceval.callsim(eventClass.Event, 2),
        Sk.misceval.callsim(eventClass.Event, 3),
        Sk.misceval.callsim(eventClass.Event, 4) ];

      events.forEach(e => Sk.misceval.callsim(eventClass.post, e));

      let pyEvents = Sk.misceval.callsim(eventClass.get);

      strictEqual(eventIsOf(pyEvents.v[0], [2]), true);
      strictEqual(eventIsOf(pyEvents.v[1], [3]), true);
      strictEqual(eventIsOf(pyEvents.v[2], [4]), true);
    });

  });

  describe('blocking and allowing', () => {

    it('should block events when it\'s set to be blocked', () => {
      Sk.misceval.callsim(eventClass.set_blocked, Sk.ffi.remapToPy(2));

      let event = Sk.misceval.callsim(eventClass.Event, 2);

      Sk.misceval.callsim(eventClass.post, event);

      let result = Sk.ffi.remapToJs(Sk.misceval.callsim(eventClass.get));

      let blocked = Sk.ffi.remapToJs(Sk.misceval.callsim(eventClass.get_blocked, Sk.ffi.remapToPy(2)));

      let notBlocked = Sk.ffi.remapToJs(Sk.misceval.callsim(eventClass.get_blocked, Sk.ffi.remapToPy(1)));

      strictEqual(blocked, true);

      strictEqual(notBlocked, false);

      strictEqual(result.length, 0);
    });

  });
});