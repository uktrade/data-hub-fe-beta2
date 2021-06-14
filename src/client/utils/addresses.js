const { get } = require('lodash')

const addressToString = (address) =>
  [
    'line_1',
    'line_2',
    'town',
    'county',
    'postcode',
    'area.name',
    'country.name',
  ]
    .map((component) => get(address, component))
    .filter((value) => value)
    .join(', ')

module.exports = { addressToString }
