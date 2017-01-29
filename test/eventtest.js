import { eventIsOf, event, Sk } from '../';
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

  describe('queue functions', () => {

    it('should return an unknown event when the queue is empty', () => {
      let event = Sk.misceval.callsim(eventClass.poll);
      strictEqual(eventIsOf(event, [0]), true);
    });

    it('should be able to post an event on the queue', () => {
      let event = Sk.misceval.callsim(eventClass.Event, 2);
      Sk.misceval.callsim(eventClass.post, event);

      strictEqual(Sk.misceval.callsim(eventClass.poll), event);
    });

  });
});