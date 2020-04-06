/* eslint-disable camelcase */
const groupExportCountries = require('../../../../lib/group-export-countries')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

function getCountryFields(countries, propName = 'country') {
  const groupedExportCountries = groupExportCountries(countries, propName)

  return {
    exportToCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.EXPORTING_TO],
    futureInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.FUTURE_INTEREST],
    noInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.NOT_INTERESTED],
  }
}

module.exports = {
  transformCompanyToExportDetailsView: (company) => {
    const countryFields = getCountryFields(company.export_countries)
    const regionFields = getCountryFields(company.export_regions, 'region')

    return {
      exportWinCategory: {
        name: exportDetailsLabels.exportExperienceCategory,
        value:
          company.export_experience_category &&
          company.export_experience_category.name,
      },

      greatProfile: {
        name: exportDetailsLabels.greatProfile,
        value: company.great_profile_status,
      },

      exportPotential: {
        name: exportDetailsLabels.exportPotential,
        value:
          exportPotentialLabels[company.export_potential] &&
          exportPotentialLabels[company.export_potential].text,
      },

      exportCountriesInformation: [
        {
          name: exportDetailsLabels.exportToCountries,
          values: countryFields.exportToCountries,
        },
        {
          name: exportDetailsLabels.futureInterestCountries,
          values: countryFields.futureInterestCountries,
        },
        {
          name: exportDetailsLabels.noInterestCountries,
          values: countryFields.noInterestCountries,
        },
      ],

      exportRegionsInformation: [
        {
          name: exportDetailsLabels.exportToCountries,
          values: regionFields.exportToCountries,
        },
        {
          name: exportDetailsLabels.futureInterestCountries,
          values: regionFields.futureInterestCountries,
        },
        {
          name: exportDetailsLabels.noInterestCountries,
          values: regionFields.noInterestCountries,
        },
      ],
    }
  },
}
