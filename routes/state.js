module.exports = (app) => {
  const express = require('express')
  app.use(express.json())

  return (state) => {
    const router = express.Router()
    
    router.get('/', (req, res) => {
      res.json(state.values())
    })

    router.post('/', (req, res) => {
      if (req.body.name) state.name = req.body.name
      if (req.body.email) state.email = req.body.email
      res.json({
        status: 200,
        message: 'OK'
      })
    })

    return router
  }
}