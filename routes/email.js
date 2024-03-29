const sgMail = require('@sendgrid/mail')

module.exports = (app) => {
  const express = require('express')
  app.use(express.json())

  return (state, table, sendgridkey) => {

    /* for sendgrid */
    const SENDGRIDKEY = sendgridkey || process.env.SENDGRIDKEY
    if(!SENDGRIDKEY) throw Error('no SENDGRIDKEY in environment')

    const router = express.Router()

    router.post('/save', async (req, res) => {
      try {
        const name = req.body.name
        const email = req.body.email
        const timestamp = req.body.timestamp || Date.now() - 30*60*1000 /* 30 mins ago */

        if(!email) throw Error('no email')
        /* get data */
        const data = await table.findUser({name, email}, timestamp)

        const html = `
          <p>data from: ${new Date(timestamp)}</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `

        const message = {
          to: email,
          from: 'data@mtndev.xyz',
          subject: 'upwall',
          text: 'data',
          html: html
        }

        sgMail.setApiKey(SENDGRIDKEY)
        let r = await sgMail.send(message)

        res.json({
          status: 200,
          message: 'OK',
          data: r
        })
      }catch(e) {
        res.json({
          status: 500,
          message: e.message
        })
      }
    })

    return router
  }
}