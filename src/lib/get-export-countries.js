const castCompactArray = require('./cast-compact-array')

const { EXPORT_INTEREST_STATUS_VALUES } = require('../apps/constants')

module.exports = (body, propName = 'country') => {
  const data = []

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const countryIds = castCompactArray(body[status])

    if (countryIds.length) {
      countryIds.forEach((id) => data.push({ [propName]: { id }, status }))
    }
  })

  return data.length ? data : null
}
