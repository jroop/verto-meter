const {TableUtil, TableClimbs} = require('./db')

describe('db', () => {

  const sampleData = [
    {
      timestamp: (new Date(1000*60*60*24*100)).getTime(),
      name: 'bob',
      email: 'test@test.test',
      start: (new Date(1000*60*60*24*100)).getTime() - 12000,
      distance: 12.5,
      speed: 7,
      time: 60.5
    },
    {
      timestamp: (new Date(1000*60*60*24*50)).getTime(),
      name: 'bob',
      email: 'test@test.com',
      start: (new Date(1000*60*60*24*50)).getTime() - 50000,
      distance: 12.5,
      speed: 7,
      time: 60.5
    },
    {
      timestamp: (new Date(1000*60*60*24*20)).getTime(),
      name: 'bob',
      email: 'test@test.test',
      start: (new Date(1000*60*60*24*50)).getTime() - 30000,
      distance: 12.5,
      speed: 7,
      time: 60.5
    }
  ]

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

  test('find user', async (done) => {
    const path = require('path')
    let dbPath = path.join(require('os').homedir(), 'verto-meter.test.db')

    /* select all items */
    let table
    try {
      table = await TableClimbs.init({
        dbPath: dbPath,
        tableName: 'user_test'
      })

      for(let r of sampleData) {
        await table.insert(r)
      }

      expect((await table.findUser({name: 'bob', email: 'test@test.test'})).length).toEqual(2)
      expect((await table.findUser({name: 'bob', email: 'test@test.test'}, (new Date(1000*60*60*24*20)).getTime())).length).toEqual(2)
      expect((await table.findUser({name: 'bob', email: 'test@test.test'}, (new Date(1000*60*60*24*21)).getTime())).length).toEqual(1)
      

    }catch(e) {
      console.error(e)
    }finally {
      await table.db.exec('DROP TABLE user_test')
      done()
    }

  })

})