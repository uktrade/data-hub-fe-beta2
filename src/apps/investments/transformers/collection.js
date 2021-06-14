/* eslint camelcase: 0 */
const { isArray, assign, compact, pickBy } = require('lodash')

const labels = require('../labels')

function transformInvestmentProjectToListItem({
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
    {
      key: 'investment_type',
      value: investment_type,
      type: 'badge',
      badgeModifier: 'secondary',
    },
    { key: 'status', value: status, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_company', value: investor_company },
    { key: 'sector', value: sector },
    {
      key: 'estimated_land_date',
      value: estimated_land_date,
      type: 'dateMonthYear',
      isInert: true,
    },
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

function transformInvestmentListItemToDisableMetaLinks(item) {
  if (!isArray(item.meta)) {
    return item
  }

  const meta = item.meta.map((metaItem) => {
    return assign({}, metaItem, { isInert: true })
  })

  return assign({}, item, { meta })
}

module.exports = {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
}
