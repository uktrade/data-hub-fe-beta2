const { pick, pickBy } = require('lodash')

const removeArray = require('../lib/remove-array')
const reverseDateIfIE = require('../lib/if-ie-reverse-date-value')

function getRequestBody(queryFields, queryDateFields = []) {
  return function (req, res, next) {
    req.query.area = []
    if (req.query.us_state) {
      req.query.area = req.query.area.concat(req.query.us_state)
    }
    if (req.query.canadian_province) {
      req.query.area = req.query.area.concat(req.query.canadian_province)
    }

    if (res.locals.userAgent) {
      queryDateFields.forEach((date) => {
        req.query[date] = reverseDateIfIE(req.query[date], res.locals.userAgent)
      })
    }

    const selectedFiltersQuery = removeArray(
      pick(req.query, queryFields.concat(queryDateFields)),
      'archived'
    )

    const selectedSortBy = req.query.sortby
      ? { sortby: req.query.sortby }
      : null

    req.body = {
      ...req.body,
      ...selectedSortBy,
      ...pickBy(selectedFiltersQuery),
    }

    next()
  }
}

module.exports = {
  getRequestBody,
}
