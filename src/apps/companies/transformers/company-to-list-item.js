/* eslint-disable camelcase */
const { get } = require('lodash')

const { getCompanyAddress } = require('./shared')
const { hqLabels } = require('../labels')

module.exports = function transformCompanyToListItem ({
  id,
  name,
  sector,
  uk_based,
  uk_region,
  trading_name,
  trading_address_country,
  trading_address_county,
  trading_address_town,
  trading_address_postcode,
  trading_address_1,
  trading_address_2,
  registered_address_country,
  registered_address_county,
  registered_address_town,
  registered_address_postcode,
  registered_address_1,
  registered_address_2,
  companies_house_data,
  modified_on,
  headquarter_type,
  global_headquarters,
  global_headquarters_archived,
  global_headquarters_duns_number,
} = {}) {
  if (!id) { return }

  const meta = []

  if (trading_name) {
    meta.push({
      label: 'Trading name',
      value: trading_name,
    })
  }

  const address = getCompanyAddress({
    trading_address_country,
    trading_address_county,
    trading_address_town,
    trading_address_postcode,
    trading_address_1,
    trading_address_2,
    registered_address_country,
    registered_address_county,
    registered_address_town,
    registered_address_postcode,
    registered_address_1,
    registered_address_2,
  })

  if (sector) {
    meta.push({
      label: 'Sector',
      value: get(sector, 'name'),
    })
  }

  if (trading_address_country || registered_address_country) {
    meta.push({
      label: 'Country',
      type: 'badge',
      value: get(trading_address_country, 'name') || get(registered_address_country, 'name'),
    })
  }

  if (uk_based) {
    meta.push({
      label: 'UK region',
      type: 'badge',
      value: get(uk_region, 'name'),
    })
  }

  if (headquarter_type) {
    meta.push({
      label: 'Headquarter type',
      type: 'badge',
      value: hqLabels[get(headquarter_type, 'name')],
    })
  }

  if (global_headquarters) {
    const { name: ghqName, id: ghqId } = global_headquarters

    meta.push({
      label: 'Global HQ',
      value: ghqName,
      url: `/companies/${ghqId}`,
    })

    if (!global_headquarters_archived && !global_headquarters_duns_number) {
      meta.push({
        label: '',
        value: 'Remove subsidiary',
        url: `/companies/${id}/hierarchies/ghq/remove`,
      })
    }
  }

  meta.push(address)

  const url = id ? `/companies/${id}` : `/companies/view/ch/${companies_house_data.company_number}`

  return {
    id,
    name,
    url,
    meta,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    type: 'company',
  }
}
