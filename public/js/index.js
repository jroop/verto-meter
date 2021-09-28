import {Formatter} from './utils.js'

const INACTIVE = 3000 /* time to wait until trigger inactive */

const updateCurrent = async (opts={}) => {

  try {
    let r = await fetch('/state')
    if (r.status !== 200) {
      console.error(r)
      throw Error(r)
    }
    let res = await r.json()

    r = await fetch('/state/users')
    if(r.status !== 200) {
      console.error(r)
      throw Error(r)
    }
    const users = await r.json()

    let delta = Date.now() - (res.time + res.start)
    let end = Formatter.timestamp(res.start + res.time)
    res = Formatter.format(res)

    /* build drop down */
    let d = ''
    for(let n of users) {
      d += `<option data-name="${n.name}" data-email="${n.email}">${n.name} (${n.email})</option>`
    }
    opts.userDrop.innerHTML = d

    opts.start.innerHTML = `
      <div class="time">start: ${res.start}</div>
      <div class="time">end: ${end}</div>
    `

    let rest = 0 /* stop the timer */
    if (delta  > INACTIVE) {
      opts.time.classList.remove('running')
      /* start rest timer */
      rest = Formatter.ms2hms(delta - INACTIVE)
      opts.rest.classList.add('resting')
    } else {
      opts.time.classList.add('running')
      opts.rest.classList.remove('resting')
    }

    opts.rest.innerHTML = `<div class="metric medium">${rest}</div><div>(rest)</div>`

    opts.time.innerHTML = `<div class="metric">${res.time}</div>`

    opts.distance.innerHTML = `
      <div class="metric medium">${res.distance}</div><div>(ft)</div>
    `
    opts.speed.innerHTML = `
      <div class="metric medium">${res.speed}</div><div>(ft/min)</div>
    `

  } catch (e) {
    console.error(e)
  }
}

window.onload = async () => {
  let userDrop = document.getElementById('user-drop')
  let start = document.getElementById('start')
  let distance = document.getElementById('distance')
  let speed = document.getElementById('speed')
  let time = document.getElementById('time')
  let rest = document.getElementById('rest')


  /* updating the user drop list */
  userDrop.onchange = async (e) => {
    const option = e.target.options[e.target.selectedIndex]

    const body = {
      name: option.getAttribute('data-name'),
      email: option.getAttribute('data-email')
    }
    try {
      let r = await fetch('/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      r = await r.json()
      if (r.status !== 200) { /* on successful update */
        alert(JSON.stringify(r, null, 2))
      }

    }catch(e) {

    }
  }
  

  setInterval(() => {
    updateCurrent({
      userDrop,
      start,
      distance,
      speed,
      time,
      rest
    })
  }, 1000)
}