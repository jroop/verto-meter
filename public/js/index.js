import {Formatter} from './utils.js'

const updateLogs = () => {
  fetch('/logs')
  .then(res => res.json())
  .then(res => {

    if (res.length > 0) {
      let headers = ``
      for(let k in res[0]) {
        headers += `<th>${k}</th>`
      }
      let record = `<table>
        <thead>
          <tr>
            ${headers}
          </tr>
        </thead>
        <tbody>`
      for (let r of res) {
        record += '<tr>'
        for (let k in r) {
          record += `<td>${r[k]}</td>`
        }
        record += '</tr>'
      }
      record += `</tbody></table>`
      document.getElementById('logs').innerHTML = record
    }
  })
  .catch(e => {
    console.error(e)
  })
}

const updateCurrent = async (opts={}) => {

  try {
    let res = await fetch('/state')
    if (res.status !== 200) {
      console.error(res)
      throw Error(res)
    }
    res = await res.json()

    let end = Formatter.timestamp(res.start + res.time)
    res = Formatter.format(res)
    console.log(res)

    /* build user block */
    opts.user.innerHTML = `
      <div>user: ${res.name} (${res.email})</div>
    `
    opts.start.innerHTML = `
      <div class="time">start: ${res.start}</div>
      <div class="time">end: ${end}</div>
    `
    opts.time.innerHTML = `
      <div class="metric">${res.time}</div>
    `
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
  setInterval(() => {
    // updateLogs()
  }, 5000)

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