/* eslint-disable camelcase */
const { filter, flatten, get, set } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const urls = require('../../../../lib/urls')
const groupExportCountries = require('../../../../lib/group-export-countries')
const getExportCountries = require('../../../../lib/get-export-countries')

const { updateCompany, saveCompanyExportDetails } = require('../../repos')
const { transformObjectToOption } = require('../../../transformers')
const transformCompanyToExportDetailsView = require('./transformer')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')

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

function getCountry(id) {
  return metadataRepo.countryOptions.find((country) => country.id === id)
}

function getPostedFormData(body) {
  const data = {
    export_experience_category: body.export_experience_category,
  }

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const options = []
      .concat(body[status])
      .filter((value) => value && value.length > 0)
    if (options.length) {
      data[status] = options.map(getCountry).map(transformObjectToOption)
    }
  })

  return data
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
      req.method === 'POST' ? getPostedFormData(req.body) : {}
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
  const { company, features, errors } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit')
    .render('companies/apps/exports/views/exports-edit', {
      errors: errors || [],
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
  const { token } = req.session
  const companyId = res.locals.company.id
  const data = {
    ...res.locals.company,
    export_experience_category: req.body.export_experience_category,
  }

  try {
    if (res.locals.features[NEW_COUNTRIES_FEATURE]) {
      await saveCompanyExportDetails(token, companyId, {
        export_countries: getExportCountries(req.body) || [],
      })
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

    await updateCompany(token, companyId, data)

    res.redirect(urls.companies.exports.index(companyId))
  } catch (err) {
    if (err.statusCode !== 400) {
      return next(err)
    }
    const nonFieldErrors = get(err.error, 'non_field_errors')

    if (nonFieldErrors) {
      set(res.locals, 'errors.nonField', nonFieldErrors)
    }
    next()
  }
}

module.exports = {
  populateExportForm,
  renderExports,
  renderExportEdit,
  handleEditFormPost,
}
