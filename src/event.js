import { notImplemented, dud, toBeImplemented } from './shared.js'
import Event from './eventclass.js'

const queue = [];
const notifiers = [];

function eventConsumer (eventtype) {
  return (event) => {
    let consumed = notifiers.reduce((l, r) => l && r(event), false);
    if (!consumed) {
      queue.push(event);
    }
  }
}

window.addEventListener("keydown", eventConsumer("keydown"));

window.addEventListener("keyup", eventConsumer("keyup"));

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
      promise: new Promise((fulfill, reject) => {
        notifiers.add(function (event) {
          fulfill(event);
          return true;
        })
      })
    };
    return susp;
  },

  'Event': Event,

  'EventType': notImplemented,
  '_PYGAME_C_API': notImplemented
}