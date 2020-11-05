import {Formatter} from './utils.js'

const updateCurrent = async (opts={}) => {

  try {
    let res = await fetch('/state')
    if (res.status !== 200) {
      console.error(res)
      throw Error(res)
    }
    res = await res.json()

    let delta = Date.now() - (res.time + res.start)
    let end = Formatter.timestamp(res.start + res.time)
    res = Formatter.format(res)

    /* build user block */
    opts.user.innerHTML = `
      <div>user: ${res.name} (${res.email})</div>
    `
    opts.start.innerHTML = `
      <div class="time">start: ${res.start}</div>
      <div class="time">end: ${end}</div>
    `


    if (delta  > 3000) {
      opts.time.classList.remove('running')
    } else {
      opts.time.classList.add('running')
    }
    opts.time.innerHTML = `<div class="metric">${res.time}</div>`

    opts.distance.innerHTML = `
      <div class="metric">${res.distance}</div><div>(ft)</div>
    `
    opts.speed.innerHTML = `
      <div class="metric">${res.speed}</div><div>(ft/min)</div>
    `


  } catch (e) {
    console.error(e)
  }
}

window.onload = async () => {

  let user = document.getElementById('user')
  let start = document.getElementById('start')
  let distance = document.getElementById('distance')
  let speed = document.getElementById('speed')
  let time = document.getElementById('time')


  setInterval(() => {
    updateCurrent({
      user,
      start,
      distance,
      speed,
      time
    })
  }, 1000)
}