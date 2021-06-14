/* eslint-disable camelcase */

const {
  formatAddress,
  formatDateTime,
} = require('../../../../config/nunjucks/filters')
const urls = require('../../../../lib/urls')
const labels = require('../../labels')

function transformCompanyToDnbHierarchyList({
  id,
  name,
  sector,
  uk_based,
  uk_region,
  trading_names,
  address,
  modified_on,
  headquarter_type,
  is_global_ultimate,
} = {}) {
  if (!id) {
    return
  }

  const metadata = []
  const badges = []

  if (trading_names && trading_names.length) {
    metadata.push({
      label: labels.hqLabels.trading_names,
      value: trading_names,
    })
  }

  if (sector && sector.name) {
    metadata.push({
      label: 'Sector',
      value: sector.name,
    })
  }

  if (address && address.country && address.country.name) {
    badges.push({
      text: address.country.name,
    })
  }

  if (uk_based && uk_region && uk_region.name) {
    badges.push({
      text: uk_region.name,
    })
  }

  if (is_global_ultimate) {
    badges.push({
      text: labels.companyDetailsLabels.ultimate_hq,
    })
  }

  if (headquarter_type) {
    badges.push({
      text: labels.hqLabels[headquarter_type.name],
    })
  }

  if (address) {
    metadata.push({
      label: labels.address.companyAddress,
      value: formatAddress(address),
    })
  }

  return {
    headingText: name,
    headingUrl: urls.companies.detail(id),
    subheading: `Updated on ${formatDateTime(modified_on)}`,
    metadata,
    badges,
  }
}

module.exports = {
  transformCompanyToDnbHierarchyList,
}
