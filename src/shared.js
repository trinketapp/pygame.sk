const none = Sk.builtin.none.none$;

export function notImplemented() {
  throw new Sk.builtin.NotImplementedError('this function is not implemented in Sklupt');
}

export function dud(retval) {
  return retval;
}

export function toBeImplemented() {
  //console.log('todo!');
}

export { none };