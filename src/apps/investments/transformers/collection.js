/* eslint camelcase: 0 */
const { isArray, assign, compact, pickBy } = require('lodash')

const labels = require('../labels')

function transformInvestmentProjectToListItem ({
  id,
  name,
  project_code,
  stage,
  investment_type,
  status,
  investor_company,
  estimated_land_date,
  sector,
}) {
  const metaItems = [
    { key: 'stage', value: stage, type: 'badge' },
    { key: 'investment_type', value: investment_type, type: 'badge', badgeModifier: 'secondary' },
    { key: 'status', value: status, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_company', value: investor_company },
    { key: 'sector', value: sector },
    { key: 'estimated_land_date', value: estimated_land_date, type: 'dateMonthYear', isInert: true },
  ].map(({ key, value, type, badgeModifier, isInert }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier, isInert }), {
      label: labels.investmentProjectMetaItemLabels[key],
    })
  })

  return {
    id,
    name,
    type: 'investments/project',
    subTitle: {
      label: 'Project code',
      value: project_code,
    },
    meta: compact(metaItems),
  }
}

function transformInvestmentListItemToDisableMetaLinks (item) {
  if (!isArray(item.meta)) { return item }

  const meta = item.meta.map(metaItem => {
    return assign({}, metaItem, { isInert: true })
  })

  return assign({}, item, { meta })
}

function transformInvestmentProjectLargeProfilesToListItem ({
  id,
  country_of_origin,
  investor_company,
  investor_type,
  modified_on,
  global_assets_under_management,
}) {
  const metaItems = [
    { key: 'updated', value: modified_on, type: 'date' },
    { key: 'country_of_origin', value: country_of_origin, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_type', value: investor_type },
    { key: 'global_assets_under_management', value: global_assets_under_management },
  ].map(({ key, value, type, badgeModifier, isInert }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier, isInert }), {
      label: labels.metaItems[key],
    })
  })

  return {
    id,
    name: investor_company.name,
    type: `large-capital-profile`,
    url: `/companies/${investor_company.id}/investments/large-capital-profile`,
    meta: compact(metaItems),
  }
}

module.exports = {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
  transformInvestmentProjectLargeProfilesToListItem,
}
