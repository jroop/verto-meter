module.exports = (app) => {
  const express = require('express')
  app.use(express.json())

  return (state) => {
    const router = express.Router()
    
    router.get('/', (req, res) => {
      res.json(state.values())
    })

    router.get('/users', (req, res) => {
      res.json(state.users)
    })

    router.get('/users/clear', (req, res) => {
      /* update the state list */
      state.clearUsers()
      res.json({
        code: 200,
        message: 'OK'
      })
    })

    router.post('/', (req, res) => {
      if (req.body.name && req.body.email){
        state.user = {name: req.body.name, email: req.body.email}
        res.json({
          status: 200,
          message: 'OK'
        })
      }else {
        res.json({
          status: 500,
          message: 'no name or email values found in post'
        })
      }
      
    })

    return router
  }
}