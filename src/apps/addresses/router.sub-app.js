const router = require('express').Router()

const createApp = require('./apps/create')
router.use(`/addresses${createApp.mountpath}`, createApp.router)

module.exports = router
