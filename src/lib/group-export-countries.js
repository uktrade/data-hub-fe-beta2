const { EXPORT_INTEREST_STATUS_VALUES } = require('../apps/constants')

module.exports = (countries, propName = 'country') => {
  const buckets = {}

  if (Array.isArray(countries)) {
    EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
      buckets[status] = []
    })

    countries.forEach((item) => {
      const bucket = buckets[item.status]
      const value = bucket && item[propName]

      if (value) {
        bucket.push(value)
      }
    })

    EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
      buckets[status] = buckets[status].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    })
  }

  return buckets
}
