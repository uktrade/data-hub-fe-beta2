/* eslint-disable camelcase */
const { flatMap } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const urls = require('../../../lib/urls')
const { exportDetailsLabels, exportPotentialLabels } = require('../labels')

function getCountries (data) {
  return flatMap(data, ({ name }) => (name || null)).join(', ') || 'None'
}

function getExportPotentialLabel (key) {
  const item = exportPotentialLabels[ key ]

  return (item && item.text) || 'No score given'
}

function getGreatProfileValue (profileStatus, companiesHouseNumber) {
  if (profileStatus === 'published') {
    return {
      url: urls.external.greatProfile(companiesHouseNumber),
      newWindow: true,
      name: '"Find a supplier" profile',
      hint: '(opens in a new window)',
    }
  } else {
    return (profileStatus === 'unpublished' ? 'Profile not published' : 'No profile')
  }
}

module.exports = function transformCompanyToExportDetailsView ({
  export_experience_category,
  export_to_countries,
  future_interest_countries,
  export_potential_score,
  great_profile,
  company_number,
}) {
  const viewRecord = {
    exportExperienceCategory: export_experience_category || 'None',
    exportToCountries: getCountries(export_to_countries),
    futureInterestCountries: getCountries(future_interest_countries),
    exportPotential: getExportPotentialLabel(export_potential_score),
    greatProfile: getGreatProfileValue(great_profile, company_number),
  }

  return getDataLabels(viewRecord, exportDetailsLabels)
}
