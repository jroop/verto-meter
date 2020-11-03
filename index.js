const express = require('express')
const app = express()
const path = require('path')

const stateAPI = require('./routes/state')(app)
const State = require('./lib/State')
const PinAlert = require('./lib/PinAlert')

let state = new State({
  distancePerTick: 0.5
})

let logs = []

let config = {
  port: process.env.APP_PORT || 8000
}

let timed = () => {
  return setTimeout(() => {
    /* save */
    console.log('save to db', state.values())
    logs.unshift(state.values())
    state.reset()
  }, 10000)
}

let ender = null
let ticker = (e, v) => {
  /* so if no ticks then stop system */
  if (ender) {
    clearTimeout(ender)
  }
  ender = timed()
  if (e) console.error(e)
  state.tick()
}

let pin = new PinAlert({pin: 4})
pin.register(ticker)

// const timer = async (t) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(t)
//     }, t)
//   })
// }

// const runner = async () => {
//   for (let t of [1000, 200, 200, 300, 2500, 300]) {
//     let res = await timer(t)
//     console.log(res)
//     ticker()
//   }
// }
// runner()


app.get('/', (req, res) => {
  res.json({name: 'hello'})
})

app.get('/logs', (req, res) => {
  res.json(logs)
})

app.use('/state', stateAPI(state))

app.use(express.static(path.join(__dirname, 'public')))

/* general error handling */
app.use((err, req, res, next) => {
  console.error(err)
  res.json({
    stack: err.stack
  })
})

app.listen(config.port, () => {
  console.log(`running on port: ${config.port}`)
})