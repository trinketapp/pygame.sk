import { eventIsOf, event, Sk, init } from '../';
import { strictEqual } from 'assert';

Sk.doOneTimeInitialization();

let eventClass = event();

describe('event', () => {

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
      global.addEventListener = function () {};

      init('');

      strictEqual(global.listeners['keyup'].length, 1);
      strictEqual(global.listeners['keydown'].length, 1);
    });

    it('shouldn\'t add the default listeners twice', () => {
      global.addEventListener = function () {};

      init('');
      init('');

      strictEqual(global.listeners['keyup'].length, 1);
      strictEqual(global.listeners['keydown'].length, 1);
    });

  });

  describe('modifier tests', () => {

    it('should add the capslock modifier when it\'s on', () => {
      let keyDown;
      init('', (eventHandler) => { keyDown = eventHandler; },  () => { });

      keyDown({ code: 'KeyA', key: 'a', getModifierState() { return true; } });
      let dict = Sk.ffi.remapToJs(Sk.abstr.gattr(Sk.misceval.callsim(eventClass.poll), 'dict', false));
      strictEqual(dict.mod, 8192);
    });

    it('should add the shift modifier when it\'s held', () => {
      let keyDown;
      init('', (eventHandler) => { keyDown = eventHandler; }, () => { });

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