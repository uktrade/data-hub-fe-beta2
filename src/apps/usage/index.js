const router = require('express').Router()
const renderUsage = require('./controllers')

module.exports = {
  router: router.get('/data-usage', renderUsage),
}
