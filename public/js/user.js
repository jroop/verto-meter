
const init = async () => {

  const successAction = () => {
    location.href = '/'
  }

  let state, time
  try {
    let r = await fetch('/state')
    if (r.status !== 200) {
      console.error(r)
      throw Error(r)
    }
    state = await r.json()
  }catch(e) {
    console/error(e)
  }

  let name = document.getElementById('name')
  let email = document.getElementById('email')

  let button = document.getElementById('submit')
  button.onclick = async (e) => {
    e.preventDefault()
    let body = {
      name: name.value,
      email: email.value
    }
    if (! body.name || ! body.email) {
      alert('Fill out all parameters')
      return
    }
    try {
      let res = await fetch('/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      res = await res.json()
      if (res.status === 200) { /* on successful update */
        successAction()
      } else {
        alert(JSON.stringify(res, null, 2))
      }
    } catch (e) {
      alert(JSON.stringify(e.stack, null, 2))
    }
  }

  /* for user list cache clear */
  const clear = document.getElementById('clear')

  clear.onclick = async (e) => {
    e.preventDefault()
    let r = await fetch('/state/users/clear')
    r = await r.json()
    location.href = '.'
  }

  /* set the current user */
  document.getElementById('user').innerHTML = `${state.name} (${state.email})`

  /* set the time back 60 mins */
  const datetime = document.getElementById('localtime')
  // datetime.setAttribute('value', new Date(Date.now() - 1000*60*60).getTime().toString())

  const save = document.getElementById('save') 

  save.onclick = async (e) => {
    e.preventDefault()
    const body = {
      name: state.name,
      email: state.email,
      timestamp: (new Date(datetime.value)).getTime()
    }
    try {
      let r = await fetch('/email/save', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      })
      console.log(await r.json())
      // location.href = '.'
    }catch(e) {
      console.error(e)
    }
  }
}

window.onload = init