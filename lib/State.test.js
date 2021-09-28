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

  test('check users', () => {
    const state = new State({distancePerTick: 0.5})
    state.user = {name: 'bob', email: 'bob@junk.test'}
    state.user = {name: 'bob', email: 'bob@junk.test'}
    expect(state.values().users.length).toEqual(1)
    state.user = {name: 'bob', email: 'bob@bob.test'}
    expect(state.users.length).toEqual(2)
    expect(state.users[0]).toEqual({name: 'bob', email: 'bob@bob.test'})
    state.user = {name: 'bob', email: 'bob@junk.test'}
    expect(state.users.length).toEqual(2)
    expect(state.users[0]).toEqual({name: 'bob', email: 'bob@junk.test'})
  })
})