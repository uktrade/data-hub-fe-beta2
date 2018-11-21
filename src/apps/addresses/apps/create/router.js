const router = require('express').Router()

const { build } = require('../../../../modules/form/journey-builder')
const steps = require('./steps')

router.use(build(steps))

module.exports = router
