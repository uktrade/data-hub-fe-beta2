const metadata = require('../../lib/metadata')
const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')

function renderIndex (req, res) {
  return res.render('components/views/index', {
    title: 'Data Hub Components',
  })
}

function transformOption (option) {
  return {
    value: option.id,
    label: option.name,
  }
}

const foreignOtherCompanyOptions = [
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

function renderFormElements (req, res) {
  return res
    .breadcrumb.add('Form elements')
    .render('components/views/form', {
      entitySearch: Object.assign({}, res.locals.entitySearch, {
        searchTerm: req.query.term,
      }),
      form: Object.assign({}, res.locals.form, {
        options: {
          countries: metadata.countryOptions.map(transformOption),
          averageSalaryRange: metadata.salaryRangeOptions.map(transformOption),
          strategicDrivers: metadata.strategicDriverOptions.map(transformOption),
          sectors: metadata.sectorOptions.map(transformOption),
          foreignOtherCompany: foreignOtherCompanyOptions.map(i => ({ value: i, label: i })),
        },
      }),
    })
}

function renderMessages (req, res) {
  return res
    .breadcrumb.add('Application messages')
    .render('components/views/messages')
}

function renderBreadcrumbs (req, res) {
  return res
    .breadcrumb.add('Breadcrumbs')
    .render('components/views/breadcrumbs')
}

function renderPagination (req, res) {
  return res
    .breadcrumb.add('Pagination')
    .render('components/views/pagination')
}

async function renderEntityList (req, res) {
  return res
    .breadcrumb.add('Entity list')
    .render('components/views/entity-list', {
      investmentProjects: await authorisedRequest(req.session.token, `${config.apiRoot}/v3/investment?limit=10`),
      companiesSearch: await authorisedRequest(req.session.token, `${config.apiRoot}/v3/search?term=samsung&entity=company&limit=10`),
      contactsSearch: await authorisedRequest(req.session.token, `${config.apiRoot}/v3/search?term=samsung&entity=contact&limit=10`),
    })
}

module.exports = {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
  renderBreadcrumbs,
  renderPagination,
}
