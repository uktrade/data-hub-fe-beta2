const { QUERY_FIELDS_MAP } = require('../constants')
const { getInteractionTimestamp } = require('../../../common/date')

const QUERY_PARAM = QUERY_FIELDS_MAP.lastInteractionDate
const START_DATE_PARAM = 'latest_interaction_date_before'
const END_DATE_PARAM = 'latest_interaction_date_after'

module.exports = (req, res, next) => {
  const value = req.body[QUERY_PARAM]

  if (value) {
    const range = [].concat(value)
    const values = []
    const l = range.length

    for (let i = 0; i < l; i++) {
      switch (range[i]) {
        case '0':
          values.push(0, 1)
          break
        case '1':
          values.push(1, 3)
          break
        case '2':
          values.push(3, 6)
          break
        case '3':
          values.push(6, 12)
          break
        case '4':
          values.push(12, 24)
          break
      }
    }

    if (values.length) {
      req.body[START_DATE_PARAM] = getInteractionTimestamp(Math.min(...values))
      req.body[END_DATE_PARAM] = getInteractionTimestamp(Math.max(...values))
    }
  }

  delete req.body[QUERY_PARAM]

  next()
}
