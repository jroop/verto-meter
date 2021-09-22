module.exports = class State {
  constructor(opts={}) {
    if (! opts.distancePerTick) throw Error('no option "distancePerTick"')
    this.opts = opts
    this._name = null
    this._email = null
    this.reset()
  }
  set name (s) {
    this._name = s
  }
  get name () {
    return this._name || null
  }
  set email (s) {
    this._email = s
  }
  get email () {
    return this._email || null
  }
  /*  reset the items */
  reset () {
    this._tick = 0
  }
  /* paces the timing values */
  tick () {
    let t = Date.now()
    if (this._tick < 1) {
      this._starttime = t
      this._prevtime = t
    }
    this._tick += 1
    this._prevtime = this._timestamp
    this._timestamp = t

    /* calcs */
    this._distance = this._tick * this.opts.distancePerTick /* ft */
    this._speed = this.opts.distancePerTick / ((t - this._prevtime) / 1000) * 60 /* ft/min */
    this._time = t - this._starttime
  }
  values () {
    return {
      timestamp: this._timestamp || Date.now(),
      name: this._name,
      email: this._email,
      start: this._starttime,
      distance: this._distance,
      speed: this._speed,
      time: this._time
    }
  }
}