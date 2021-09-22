const {TableUtil, TableClimbs} = require('./db')

describe('db', () => {

  test('table names', async (done) => {
    const path = require('path')
    let dbPath = path.join(require('os').homedir(), 'verto-meter.test.db')
    let db
    try {
      let table = await TableUtil.init({
        dbPath: dbPath,
        tableName: 'ticks_test'
      })
      db = table.db
      await db.exec('CREATE TABLE IF NOT EXISTS ticks_test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, age INTEGER)')
      let res = await table.headers()
      expect(res).toEqual(['id', 'name', 'age'])
      await table.insert({name: 'bobby', age: 30})
      await table.insert({name: 'test', age: 43})
      res = await db.all('SELECT * FROM ticks_test')
      expect(res.length).toEqual(2)
      expect(res[1]).toEqual({id: 2, name: 'test', age: 43})
    } catch (e) {
      console.error(e)
    }
    await db.exec('DROP TABLE ticks_test')
    done()
  })

  test('create table', async (done) => {
    const path = require('path')
    let dbPath = path.join(require('os').homedir(), 'verto-meter.test.db')
    let db, res
    try {
      let data = {
        timestamp: Date.now(),
        name: 'bob',
        email: 'test@test.test',
        start: Date.now(),
        distance: 12.5,
        speed: 7,
        time: 60.5
      }
      let table = await TableClimbs.init({
        dbPath: dbPath,
        tableName: 'ticks_test'
      })
      db = table.db
      table.insert(data)
      res = await table.findAll()
      data['climb_id'] = 1
      expect(res).toEqual([data])
    } catch (e) {
      console.error(e)
    }
    await db.exec('DROP TABLE ticks_test')
    done()
  })

})