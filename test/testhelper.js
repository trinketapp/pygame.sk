function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Expected: ${expected} actual: ${actual} ${message || ''}`);
  }
}

export { strictEqual };