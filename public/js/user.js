
const init = async () => {

  const successAction = () => {
    location.href = '/'
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
}

window.onload = init