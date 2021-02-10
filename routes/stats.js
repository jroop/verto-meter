module.exports = (app) => {
  const express = require('express')
  app.use(express.json())

  return (table) => {
    const router = express.Router()

    const db = table.db /* sqlite db */

    router.post('/user', async (req, res) => {
      
    })
  }
}