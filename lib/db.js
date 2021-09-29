const sqlite3 = require('sqlite3')
const {open} = require('sqlite')


class Database {
  constructor(opts={}) {
    this.opts = opts
    this.db = opts.db
  }
  static async init (opts={}) {
    let db = await open({
      filename: opts.dbPath,
      driver: sqlite3.cached.Database
    })
    opts.db = db
    return new Database(opts)
  }
}

/* helper db utilities */
class TableUtil extends Database {
  constructor(opts={}) {
    super(opts)
    this._headers = []
    this.tableName = opts.tableName
  }
  static async init(opts={}) { 
    opts = (await super.init(opts)).opts
    return new TableUtil(opts)
  }
  async headers () {
    if (this._headers.length > 0) return this._headers

    let res = await this.db.get(`SELECT group_concat(name,'|') FROM pragma_table_info('${this.tableName}')`)
    this._headers = res["group_concat(name,'|')"].split('|')
    return this._headers
  }
  async insert (obj) {
    let values = []
    let names = []
    for (let k in obj) {
      names.push(k)
      values.push(obj[k])
    }
    return await this.db.run(
      `INSERT INTO ${this.tableName} (${names.join(',')}) VALUES (${names.map(v => {return '?'}).join(',')})`,
      ...values
    )
  }
  async findAll () {
    return await this.db.all(`SELECT * FROM ${this.tableName}`)
  }
}

class TableClimbs extends TableUtil {
  constructor(opts={}) {
    super(opts)
  }
  static async init(opts={}) { 
    opts = (await super.init(opts)).opts

    /* generate the specific table */
    await opts.db.exec(`CREATE TABLE IF NOT EXISTS ${opts.tableName} (
      climb_id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      name TEXT,
      email TEXT,
      start INTEGER,
      distance REAL,
      speed REAL,
      time INTEGER
    )`)
    return new TableClimbs(opts)
  }
  async findAll (descending=false) {
    let order = descending === true ? 'DESC' : 'ASC'
    return await this.db.all(`SELECT * FROM ${this.tableName} ORDER BY climb_id ${order}`)
  }
  /* find based on user and newer than time */
  async findUser (user, timestamp) {
    timestamp = timestamp || (new Date(0)).getTime() /* no time cutoff */
    const email = user.email || null
    return await this.db.all(`
      SELECT * FROM ${this.tableName}
      WHERE email = '${email}' AND timestamp >= ${timestamp}
      ORDER BY timestamp DESC
    `)
  }
}

module.exports = {
  TableUtil: TableUtil,
  TableClimbs: TableClimbs
}

