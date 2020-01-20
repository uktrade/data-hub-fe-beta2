/* eslint-disable camelcase */
const pluralise = require('pluralise')
const { flatMap } = require('lodash')

const urls = require('../../../../lib/urls')
const groupExportCountries = require('../../../../lib/group-export-countries')
const { getDataLabels } = require('../../../../lib/controller-utils')
const { formatDateTime } = require('../../../../config/nunjucks/filters')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')
const { COUNTRY_HISTORY_TYPES } = require('../../constants')

const TYPES = {
  INTERACTION: 'interaction',
  COUNTRY: {
    FUTURE: 'export_country_future_interest',
    CURRENT: 'export_country_currently_exporting',
    NO_INTEREST: 'export_country_no_interest',
  },
}
const COUNTRY_HISTORY_TYPE_TEXT = {
  [COUNTRY_HISTORY_TYPES.INSERT]: 'added to',
  [COUNTRY_HISTORY_TYPES.DELETE]: 'removed from',
}
const COUNTRY_TYPE_TEXT = {
  [TYPES.COUNTRY.FUTURE]: 'future countries of interest',
  [TYPES.COUNTRY.CURRENT]: 'currently exporting',
  [TYPES.COUNTRY.NO_INTEREST]: 'countries of no interest',
}

function getCountries(data) {
  return flatMap(data, ({ name }) => name || null).join(', ') || 'None'
}

function getExportPotentialLabel(key) {
  const item = exportPotentialLabels[key]

  return (item && item.text) || 'No score given'
}

function getGreatProfileValue(profileStatus, companiesHouseNumber) {
  if (profileStatus === 'published') {
    return {
      url: urls.external.greatProfile(companiesHouseNumber),
      newWindow: true,
      name: '"Find a supplier" profile',
      hint: '(opens in a new window)',
    }
  }
  return profileStatus === 'unpublished'
    ? 'Profile not published'
    : 'No profile'
}

function getCountriesFields(company, useNewCountries) {
  if (useNewCountries) {
    const buckets = groupExportCountries(company.export_countries)

    return {
      exportToCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO]
      ),
      futureInterestCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]
      ),
      noInterestCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED]
      ),
    }
  }
  return {
    exportToCountries: getCountries(company.export_to_countries),
    futureInterestCountries: getCountries(company.future_interest_countries),
  }
}

function getCountryText(countries, historyType, type) {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[type]

  return [countries.join(', '), historyTypeText, typeText].join(' ')
}

function createInteraction(item) {
  return {
    headingText: item.subject,
    badges: ['Interaction'],
    metadata: [
      { label: 'Date', value: formatDateTime(item.created_on) },
      {
        label: pluralise(item.contacts.length, 'Contact'),
        value: item.contacts.map(({ name }) => name).join(', '),
      },
      {
        label: pluralise(item.dit_participants.length, 'Advisor'),
        value: item.dit_participants.map(({ adviser }) => adviser).join(', '),
      },
      {
        label: 'Service',
        value: item.service,
      },
    ],
  }
}

function createCountry(item) {
  return {
    headingText: getCountryText(item.countries, item.edit_history, item.type),
    metadata: [
      { label: 'By', value: item.modified_by },
      { label: 'Date', value: formatDateTime(item.modified_on) },
    ],
  }
}

function createType(item) {
  if (item.type === TYPES.INTERACTION) {
    return createInteraction(item)
  }

  return createCountry(item)
}
module.exports = {
  createExportHistory: (data) => ({
    count: data.count,
    results: data.results.map(createType),
  }),
  transformCompanyToExportDetailsView: (company, useNewCountries) => {
    const labels = {
      ...exportDetailsLabels,
    }
    const viewRecord = {
      exportExperienceCategory: company.export_experience_category || 'None',
      ...getCountriesFields(company, useNewCountries),
      exportPotential: getExportPotentialLabel(company.export_potential),
      greatProfile: getGreatProfileValue(
        company.great_profile_status,
        company.company_number
      ),
    }

    // Whilst we have the feature flag we have to delete the new label
    // Otherwise a new field will be displayed with no value
    // @TODO remove this when the feature flag is removed
    if (!useNewCountries) {
      delete labels.noInterestCountries
    }

    return getDataLabels(viewRecord, labels)
  },
}
