import { notImplemented, dud, toBeImplemented } from './shared.js'

window.addEventListener("keypress", function(event) {

});

export default {
  '__package__': Sk.builtin.none.none$,
  '__doc__': 'pygame module for interacting with events and queues',
  '__name__': 'pygame.event',

  'get_grab': dud,
  'set_grab': dud,
  'pump': dud,

  'set_blocked': toBeImplemented,
  'set_allowed': toBeImplemented,
  'get_blocked': toBeImplemented,
  'poll': toBeImplemented,
  'post': toBeImplemented,
  'get': toBeImplemented,
  'event_name': toBeImplemented,
  'clear': toBeImplemented,
  'peek': toBeImplemented,
  'wait': function () {
    var susp = Sk.misceval.Suspension();
    susp.data = {
      type: "Sk.promise",
      promise: new Promise(fulfill, reject) {

      }
    }
    return susp;
  },
  'EventType': notImplemented,
  'Event': notImplemented,
  '_PYGAME_C_API': notImplemented,
}