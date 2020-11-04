class Formatter {

  static timestamp (t) {
    if (t) {
      return (new Date(t)).toLocaleString()
    }
    return t
  }
  static pad (s,width=2) {
    let r = `${s}`
    while (r.length < width) {
      r = `0${r}`
    }
    return r
  }
  static ms2hms (t) {
    if (t) {
      let hh = Math.floor(t / 3600000)
      let mm = Math.floor(t / 60000) % 60
      let ss = Math.floor(t / 1000) % 60
      return `${Formatter.pad(hh)}:${Formatter.pad(mm)}:${Formatter.pad(ss)}`
    }
    return t
  }
  static format (o) {
    let r = {}
    for (let k in o) {
      if (o[k] !== null && k === 'timestamp' || k === 'start') {
        r[k] = Formatter.timestamp(o[k])
      } else if(k === 'time') { /* timer function */
        r[k] = Formatter.ms2hms(o[k])
      } else if (k === 'speed') {
        r[k] = Math.floor(o[k])
      } else {
        r[k] = o[k]
      }
    }
    return r
  }
}

export {Formatter}