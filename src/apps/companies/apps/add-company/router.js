const router = require('express').Router()

const {
  renderAddCompanyForm,
  blah,
} = require('./controllers')

router.get('/', renderAddCompanyForm)
router.post('/blah', blah)

module.exports = router
