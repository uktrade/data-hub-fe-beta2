/* eslint-disable camelcase */
const { filter, flatten } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const urls = require('../../../../lib/urls')
const groupExportCountries = require('../../../../lib/group-export-countries')
const getExportCountries = require('../../../../lib/get-export-countries')

const { saveCompany } = require('../../repos')
const { transformObjectToOption } = require('../../../transformers')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const {
  transformCompanyToExportDetailsView,
  createExportHistory,
} = require('./transformer')
const repos = require('./repos')

const {
  NEW_COUNTRIES_FEATURE,
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
} = require('../../../constants')

function getId(obj) {
  return obj.id
}

function getExportCountryGroups(countries = []) {
  const buckets = groupExportCountries(countries)

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    buckets[status] = buckets[status].map(transformObjectToOption)
  })

  return buckets
}

function renderExports(req, res) {
  const { company, features } = res.locals
  const exportDetails = transformCompanyToExportDetailsView(
    company,
    features[NEW_COUNTRIES_FEATURE]
  )

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports')
    .render('companies/apps/exports/views/exports-view', {
      exportDetails,
      exportPotentials: Object.values(exportPotentialLabels),
      findExportersUrl: urls.external.findExporters(),
      feedbackLink: urls.support(),
    })
}

function populateExportForm(req, res, next) {
  const {
    export_to_countries,
    future_interest_countries,
    export_experience_category,
    export_countries,
  } = res.locals.company

  if (res.locals.features[NEW_COUNTRIES_FEATURE]) {
    res.locals.formData = Object.assign(
      {
        export_experience_category,
        ...getExportCountryGroups(export_countries),
      },
      req.body
    )
  } else {
    res.locals.formData = Object.assign(
      {
        export_experience_category,
        export_to_countries: export_to_countries.map(getId),
        future_interest_countries: future_interest_countries.map(getId),
      },
      req.body
    )
  }

  next()
}

function renderExportEdit(req, res) {
  const { company, features } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit')
    .render('companies/apps/exports/views/exports-edit', {
      exportDetailsLabels,
      exportExperienceCategories: metadataRepo.exportExperienceCategory.map(
        transformObjectToOption
      ),
      countryOptions: metadataRepo.countryOptions.map(transformObjectToOption),
      useNewCountries: features[NEW_COUNTRIES_FEATURE],
      countriesFields: {
        [EXPORT_INTEREST_STATUS.EXPORTING_TO]:
          exportDetailsLabels.exportToCountries,
        [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]:
          exportDetailsLabels.futureInterestCountries,
        [EXPORT_INTEREST_STATUS.NOT_INTERESTED]:
          exportDetailsLabels.noInterestCountries,
      },
    })
}

async function handleEditFormPost(req, res, next) {
  const data = {
    ...res.locals.company,
    export_experience_category: req.body.export_experience_category,
  }

  if (res.locals.features[NEW_COUNTRIES_FEATURE]) {
    data.export_countries = getExportCountries(req.body) || []
  } else {
    const exportToCountries = flatten([req.body.export_to_countries])
    const futureInterestCountries = flatten([
      req.body.future_interest_countries,
    ])

    Object.assign(data, {
      export_to_countries: filter(exportToCountries),
      future_interest_countries: filter(futureInterestCountries),
    })
  }

  try {
    const save = await saveCompany(req.session.token, data)

    res.redirect(urls.companies.exports.index(save.id))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  populateExportForm,
  renderExports,
  renderExportEdit,
  handleEditFormPost,
  renderExportCountries: async (req, res) => {
    const { company } = res.locals
    const data = await repos.getCompanyHistory()

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Exports', urls.companies.exports.index(company.id))
      .breadcrumb('Export markets history - all countries')
      .render('companies/apps/exports/views/countries', {
        props: {
          data: createExportHistory(data),
        },
      })
  },
}
