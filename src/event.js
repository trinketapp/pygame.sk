import { notImplemented, dud } from './shared.js';
import { mapEvent, reveseLookup } from './locals.js';
import Sk from './skulpt.js';
import EventClass from './eventclass.js';

const notifiers = [];
let queue = [];

const blackList = new Set();
const whiteList = new Set();

function eventConsumer (eventtype) {
  return (event) => {
    let pygameEvent = mapEvent(eventtype, event);
    let consumed = notifiers.reduce((l, r) => l || r(pygameEvent), false);
    if (!consumed && isAllowed(pygameEvent)) {
      queue.push(pygameEvent);
    }
  };
}

const handler = (fulfill, susp, consume) => event => {
  susp.result = event;
  fulfill(event);
  return consume;
};

const eventIsOf = (e, types) => types.indexOf(Sk.ffi.remapToJs(Sk.abstr.gattr(e, 'type', false))) !== -1;

const queueContains = (types) => !!queue.find(e => eventIsOf(e, types));

function isAllowed(e) {
  if (whiteList.size > 0) {
    return eventIsOf(e, Array.from(whiteList));
  }

  if (blackList.size > 0) {
    return !eventIsOf(e, Array.from(blackList));
  }

  return true;
}

if (typeof(window) !== 'undefined') {
  window.addEventListener('keydown', eventConsumer('keydown'));
  window.addEventListener('keyup', eventConsumer('keyup'));
}

const event_locs = {
  '__package__': Sk.builtin.none.none$,
  '__doc__': 'pygame module for interacting with events and queues',
  '__name__': 'pygame.event',

  'get_grab': dud,
  'set_grab': dud,
  'pump': dud,

  poll() {
    return queue.length ? queue.pop() : Sk.misceval.callsimOrSuspend(event_locs.Event, Sk.ffi.remapToPy(0));
  },
  post(event) {
    Sk.builtin.pyCheckArgs('post', arguments, 1, 1);
    if (isAllowed(event)) {
      queue.push(event);
    }
  },
  get(type) {
    if (type) {
      let types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];

      try {
        return Sk.ffi.remapToPy(queue.filter(e => eventIsOf(e, types)));
      } finally {
        queue = queue.filter(e => !eventIsOf(e, types));
      }
    }

    try {
      return Sk.ffi.remapToPy(queue);
    } finally {
      queue.length = 0;
    }
  },
  clear() {
    queue.length = 0;
    return Sk.builtin.none.none$;
  },
  peek(type) {
    if (type) {
      if (Sk.builtin.checkIterable(type)) {
        let types = Sk.ffi.remapToJs(type);
        return Sk.ffi.remapToPy(queueContains(types));
      }

      return Sk.ffi.remapToPy(queueContains([Sk.ffi.remapToJs(type)]));
    }

    return queue.length ? queue[0] : Sk.misceval.callsimOrSuspend(event_locs.Event, Sk.ffi.remapToPy(0));
  },
  wait() {
    let chandler = null;

    let susp = new Sk.misceval.Suspension();

    susp.data = {
      type: 'Sk.promise',
      promise: new Promise((fulfill) => {
        chandler = handler(fulfill, susp, true);
        notifiers.push(chandler);
      })
    };

    susp.resume = function() {
      //remove handler when we're done waiting
      notifiers.splice(notifiers.indexOf(handler), 1);

      return susp.result;
    };

    return susp;
  },
  event_name: (type) => Sk.ffi.remapToPy(reveseLookup(Sk.ffi.remapToJs(type))),
  set_blocked(type) {
    Sk.builtin.pyCheckArgs('set_blocked', arguments, 1, 1);
    let types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];
    types.forEach(t => blackList.add(t));
    return Sk.builtin.none.none$;
  },
  set_allowed(type) {
    Sk.builtin.pyCheckArgs('set_allowed', arguments, 1, 1);
    let types = Sk.builtin.checkIterable(type) ? Sk.ffi.remapToJs(type) : [Sk.ffi.remapToJs(type)];
    types.forEach(t => whiteList.add(t));
    return Sk.builtin.none.none$;
  },
  get_blocked(type) {
    Sk.builtin.pyCheckArgs('get_blocked', arguments, 1, 1);
    let jstype = Sk.ffi.remapToJs(type);
    return Sk.ffi.remapToPy(blackList.has(jstype));
  },

  'EventType': notImplemented,
  '_PYGAME_C_API': notImplemented
};

export function clearHandlers() {
  notifiers.length = 0;
}

export { eventIsOf };

export default function event() {
  event_locs.Event =  EventClass(event_locs);
  event_locs.Event.$isclass = true;
  return event_locs;
}