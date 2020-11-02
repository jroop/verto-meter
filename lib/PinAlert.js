const Gpio = require('onoff').Gpio

class PinAlert {
  constructor(opts={}) {
    if (opts.pin === undefined) throw Error('must define a pin')

    this.opts = opts
    this.pin = new Gpio(opts.pin, 'in', 'falling')

    this.cbs = []

    this.pin.watch((e, v) => {
      /* loop over the callbacks */
      for (let f of this.cbs) {
        f(e, v)
      }
    })

    /* clean up */
    process.on('SIGINT', () => {
      this.pin.unexport()
    })
  }
  registerCB (f) {
    this.cbs.push(f)
  }
}
module.exports = PinAlert