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
      console.log(eventClass.event_name);
      strictEqual(Sk.misceval.callsim(eventClass.event_name, Sk.ffi.remapToPy(2)), 'KeyDown');
    });

  });
});