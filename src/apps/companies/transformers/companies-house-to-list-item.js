/* eslint-disable camelcase */
const { capitalize } = require('lodash')

const { transformSicCodes } = require('./shared')

module.exports = function transformCompaniesHouseToListItem ({
  name,
  registered_address_1,
  registered_address_2,
  registered_address_town,
  registered_address_county,
  registered_address_postcode,
  registered_address_country,
  company_number,
  company_category,
  company_status,
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
  incorporation_date,
}) {
  const sicCodes = transformSicCodes({ sic_code_1, sic_code_2, sic_code_3, sic_code_4 })

  return {
    name: capitalize(name),
    id: company_number,
    type: 'companies_house',
    url: `/view/ch/${company_number}`,
    meta: [
      {
        label: 'Status',
        value: company_status,
        type: 'badge',
      },
      {
        label: 'Company number',
        value: company_number,
      },
      {
        label: 'Type',
        value: company_category,
      },
      {
        label: 'Nature of business (SIC)',
        value: sicCodes,
      },
      {
        label: 'Incorporated on',
        value: incorporation_date,
        type: 'date',
      },
      {
        label: 'Address',
        type: 'address',
        value: {
          line_1: registered_address_1,
          line_2: registered_address_2,
          town: registered_address_town,
          county: registered_address_county,
          postcode: registered_address_postcode,
          country: registered_address_country,
        },
      },
    ],
  }
}
