const State = require('./State')

const waiter = (t) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(t)
    }, t)
  })
}

describe('State', () => {

  test('create', async (done) => {
    let state = new State({distancePerTick: 0.5})
    state.tick()
    await waiter(250)
    state.tick()
    await waiter(250)
    state.tick()
    expect(state.values().distance).toEqual(1.5)
    expect(state.values().time).toBeGreaterThanOrEqual(400)
    done()

  })
})