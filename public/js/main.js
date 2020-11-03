

const updateLogs = () => {
  fetch('/logs')
  .then(res => res.json())
  .then(res => {
    console.log(res)

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

const updateCurrent = () => {
  fetch('/state')
  .then(res => res.json())
  .then(res => {
    console.log(res)
    let record = `<div>`
    for (let k in res) {
      record += `<div>${res[k]}</div>`
    }
    document.getElementById('current').innerHTML = record
  })
  .catch(e => {
    console.error(e)
  })
}

window.onload = async () => {
  setInterval(() => {
    updateLogs()
  }, 5000)
  setInterval(() => {
    updateCurrent()
  }, 1000)
}