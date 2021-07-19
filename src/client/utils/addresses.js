const { get, compact } = require('lodash')

function getCompanyAddress(dnb_company, features) {
  const isAddressAreaEnabled = features?.isAddressAreaEnabled

  if (dnb_company) {
    return compact([
      dnb_company.address_line_1,
      dnb_company.address_line_2,
      dnb_company.address_town,
      dnb_company.address_county,
      isAddressAreaEnabled ? dnb_company.address_area_name : null,
      dnb_company.address_postcode,
    ]).join(', ')
  }
}

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

module.exports = { addressToString, getCompanyAddress }
