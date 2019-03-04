/* eslint-disable camelcase */
const { get, isPlainObject } = require('lodash')

const { formatLongDate } = require('../../../../common/date')

function transformInvestmentLandingForView (data) {
  if (!isPlainObject(data)) {
    return
  }

  return {
    uk_company: data.uk_company ? { name: data.uk_company.name, url: `/companies/${data.uk_company.id}` } : null,
    company_number: get(data, 'uk_company.company_number'),
    registered_address: data.uk_company ? [
      data.uk_company.registered_address_1,
      data.uk_company.registered_address_2,
      data.uk_company.registered_address_town,
      data.uk_company.registered_address_country.name,
      data.uk_company.registered_address_county,
      data.uk_company.registered_address_postcode,
    ].filter((address) => address) : null,
    actual_land_date: data.actual_land_date ? formatLongDate(data.actual_land_date) : null,
  }
}

module.exports = { transformInvestmentLandingForView }
