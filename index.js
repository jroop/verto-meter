const PinAlert = require('./lib/PinAlert')

let pin = new PinAlert({pin: 4})

let tick = 0

pin.register((e, v) => {
  if (e) {
    console.error(e)
  } else {
    console.log(`tick: ${tick +=1}`)
  }
})