const router = require('express').Router()
const urls = require('../../lib/urls')
const { spaFallbackSpread } = require('../../middleware/spa-fallback')
const { renderDashboard } = require('./controllers')

module.exports = {
  router: router.get(
    ...spaFallbackSpread(urls.dashboard.route),
    renderDashboard
  ),
}
