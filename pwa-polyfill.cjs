const crypto = require('crypto')
if (!globalThis.crypto) {
  globalThis.crypto = {
    getRandomValues: (buf) => crypto.randomFillSync(buf),
  }
}
