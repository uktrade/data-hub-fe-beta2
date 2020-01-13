const router = require('express').Router()

const urls = require('../../../../lib/urls')

const setReturnUrl = require('../../middleware/set-return-url')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
  renderExportCountries,
} = require('./controller')

router.get(urls.companies.exports.index.route, setReturnUrl, renderExports)

router
  .route(urls.companies.exports.edit.route)
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router.get(urls.companies.exports.countries.route, renderExportCountries)

module.exports = router
