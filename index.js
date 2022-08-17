const express = require('express')
const app = express()
const path = require('path')

const stateAPI = require('./routes/state')(app)
const emailAPI = require('./routes/email')(app)
const State = require('./lib/State')
const PinAlert = require('./lib/PinAlert')
const {TableUtil, TableClimbs} = require('./lib/db')

/* sendgrid key */
const sendgridfile = require('/etc/keys/sendgrid.json')
const sendgridkey = sendgridfile.APIKEY



let table = null /* save reference to database */

let config = {
  PORT: process.env.APP_PORT || 80,
  TIMETOSAVE: process.env.APP_TIMETOSAVE || 10000,
  DISTANCEPERTICK: process.env.APP_DISTANCEPERTICK || 0.5, /* ft */
  NOGPIO: process.env.APP_NOGPIO || false, /* set true if no RPI pins */
  TICKPIN: process.env.APP_TICKPIN || 4, /* GPIO pin to use */
  DBPATH: process.env.APP_DBPATH || path.join(require('os').homedir(), 'verto-meter.db'),
  DBTABLE: process.env.APP_DBTABLE || 'climbs'
}

let state = new State({
  distancePerTick: config.DISTANCEPERTICK
})


const main = async () => {
  try {
    table = await TableClimbs.init({
      dbPath: config.DBPATH,
      tableName: config.DBTABLE
    })
    app.use('/email', emailAPI(state, table, sendgridkey))
  } catch (e) {
    console.error(e)
  }
}
main()

let timed = () => {
  return setTimeout(async () => {
    /* save */
    console.log('save to db', state.values())
    try {
      await table.insert(state.values())
    } catch (e) {
      console.error(e)
    }
    state.reset()
  }, config.TIMETOSAVE)
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


if (config.NOGPIO) {
  const timer = async (t) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(t)
      }, t)
    })
  }

  const runner = async () => {
    for (let t of [1000, 500, 500, 500, 500, 500]) {
      let res = await timer(t)
      console.log(res)
      ticker()
    }
  }
  runner()
} else { /* have GPIO pins connected */
  let pin = new PinAlert({pin: config.TICKPIN})
  pin.register(ticker)
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'))
})

app.get('/climbs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'climbs.html'))
})

app.get('/logs', async (req, res) => {
  res.json(await table.findAll(true))
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

app.listen(config.PORT, () => {
  console.log(`running on port: ${config.PORT}`)
})