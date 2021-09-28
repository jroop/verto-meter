const _ = require('lodash')

module.exports = class State {
  constructor(opts={}) {
    if (! opts.distancePerTick) throw Error('no option "distancePerTick"')
    this.opts = opts
    this._user = {
      
    }
    /* hold a recent list of users */
    this._users = []
    this.reset()
  }
  /* manage the users state */
  _addUser(user) {
    /* look for user in the list if so remove it */
    let users = []
    users = this._users.map(v => { /* return non equal users */
      if(_.isEqual(user, v)) return false
      return v
    }).filter(Boolean)
    users.unshift(user) /* add new user to front of array */
    this._users = users
  }
  set user (user) {
    this._user = {
      name: user.name || null,
      email: user.email || null
    }
    this._addUser(this._user)
  }
  get user () {
    return this._user || null
  }
  get users () {
    return this._users
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
  values () { /* saved to db */
    return {
      timestamp: this._timestamp || Date.now(),
      name: this._user.name,
      email: this._user.email,
      start: this._starttime,
      distance: this._distance,
      speed: this._speed,
      time: this._time,
    }
  }
}