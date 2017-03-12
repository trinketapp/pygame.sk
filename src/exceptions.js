import Sk from './skulpt.js';

function PygameError() {
  var o;
  if (!(this instanceof PygameError)) {
    o = Object.create(PygameError.prototype);
    o.constructor.apply(o, arguments);
    return o;
  }
  Sk.builtin.StandardError.apply(this, arguments);
}

Sk.abstr.setUpInheritance('PygameError', PygameError, Sk.builtin.StandardError);

export { PygameError };