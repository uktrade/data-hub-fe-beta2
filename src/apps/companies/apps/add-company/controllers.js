/* eslint-disable camelcase */

const { transformCountryToOptionWithIsoCode } = require('../../../transformers')
const { fetchOrganisationTypes } = require('./repos')
const { searchDnbCompanies } = require('../../../../modules/search/services')
const { getOptions } = require('../../../../lib/options')
const { transformToDnbCompanyInvestigationApi } = require('./transformers')
const {
  saveDnbCompany,
  updateCompany,
  saveDnbCompanyInvestigation,
} = require('../../repos')

async function renderAddCompanyForm(req, res, next) {
  try {
    const { token } = req.session
    const [countries, organisationTypes, regions, sectors] = await Promise.all([
      getOptions(token, 'country', {
        transformer: transformCountryToOptionWithIsoCode,
      }),
      fetchOrganisationTypes(token),
      getOptions(token, 'uk-region'),
      getOptions(token, 'sector'),
    ])

    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container', {
        props: {
          countries,
          organisationTypes,
          regions,
          sectors,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function postSearchDnbCompanies(req, res, next) {
  try {
    const results = await searchDnbCompanies({
      token: req.session.token,
      requestBody: req.body,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompany(req, res, next) {
  const { token } = req.session
  const { uk_region, sector, dnbCompany } = req.body

  try {
    const company = await saveDnbCompany(token, dnbCompany.duns_number)
    const result = await updateCompany(token, company.id, {
      uk_region,
      sector,
    })

    req.flash('success', 'Company added to Data Hub')
    res.json(result)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompanyInvestigation(req, res, next) {
  try {
    const transformed = transformToDnbCompanyInvestigationApi(req.body)
    const result = await saveDnbCompanyInvestigation(
      req.session.token,
      transformed
    )
    req.flash('success', 'Company added to Data Hub')
    res.json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
  postAddDnbCompanyInvestigation,
}
