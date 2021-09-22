import { Formatter } from './utils.js'

window.onload = async () => {

  let climbs = document.getElementById('climbs')

  try {
    let res = await fetch('/logs')
    if (res.status !== 200) throw Error(res)
    res = await res.json()

    let html = res.map((row, i) => {
      let s = '<div class="record">'
      row = Formatter.format(row)
      for (let k in row) {
        s += `<div class="parameter"><div>${k}</div><div>${row[k]}</div></div>`
      }
      s += '</div>'
      return s
    })

    climbs.innerHTML = html.join('')


  } catch (e) {
    console.error(e)
  }
}