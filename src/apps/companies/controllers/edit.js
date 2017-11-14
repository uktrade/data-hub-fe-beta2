const { assign, find, get } = require('lodash')

const companyFormattingService = require('../services/formatting')

const { buildUkOtherCompanyOptions, buildForeignOtherCompanyOptions } = require('../options')

function getBusinessTypeOption (businessTypeUUID) {
  const ukOtherCompanyOptions = buildUkOtherCompanyOptions()
  const foreignOtherCompanyOptions = buildForeignOtherCompanyOptions()
  return (
    find(ukOtherCompanyOptions, { value: businessTypeUUID }) ||
    find(foreignOtherCompanyOptions, { value: businessTypeUUID })
  )
}

function getBusinessTypeLabel (isLimitedCompany, isForeign, businessTypeUUID) {
  if (isLimitedCompany) {
    return 'UK limited company'
  }
  const businessTypeOption = getBusinessTypeOption(businessTypeUUID)
  if (businessTypeOption) {
    return (isForeign ? 'Foreign ' : 'UK ') + businessTypeOption.label
  }
}

function renderForm (req, res) {
  const pageTitle = res.locals.company ? 'Edit' : 'Add company'
  let isForeign = false

  if (res.locals.company) {
    res.breadcrumb(get(res.locals, 'company.name'), `/companies/${get(res.locals, 'company.id')}`)
    isForeign = !(get(res.locals, 'company.uk_based'))
  }

  if (req.query.country === 'non-uk') {
    isForeign = true
  }
  const isCompaniesHouse = !!res.locals.companiesHouseRecord

  if (res.locals.companiesHouseRecord) {
    res.locals = assign({}, res.locals, {
      isCompaniesHouse,
      chDetails: companyFormattingService.getDisplayCH(res.locals.companiesHouseRecord),
    })
  }
  const businessTypeLabel = getBusinessTypeLabel(
    isCompaniesHouse, isForeign, res.locals.businessType
  )

  res
    .breadcrumb(pageTitle)
    .render('companies/views/edit', {
      isForeign,
      businessTypeLabel,
    })
}

module.exports = {
  renderForm,
  getBusinessTypeLabel,
}
