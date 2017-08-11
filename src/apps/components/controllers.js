const metadata = require('../../lib/metadata')
const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')
const {
  transformObjectToOption,
  transformStringToOption,
} = require('../transformers')

const { buildPagination } = require('../../lib/pagination')
const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')

function renderIndex (req, res) {
  return res.render('components/views/index', {
    title: 'Data Hub Components',
  })
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
    .breadcrumb('Form elements')
    .render('components/views/form', {
      entitySearch: Object.assign({}, res.locals.entitySearch, {
        searchTerm: req.query.term,
      }),
      form: Object.assign({}, res.locals.form, {
        options: {
          countries: metadata.countryOptions.map(transformObjectToOption),
          averageSalaryRange: metadata.salaryRangeOptions.map(transformObjectToOption),
          strategicDrivers: metadata.strategicDriverOptions.map(transformObjectToOption),
          sectors: metadata.sectorOptions.map(transformObjectToOption),
          foreignOtherCompany: foreignOtherCompanyOptions.map(transformStringToOption),
        },
      }),
    })
}

function renderMessages (req, res) {
  return res
    .breadcrumb('Application messages')
    .render('components/views/messages')
}

function renderBreadcrumbs (req, res) {
  return res
    .breadcrumb('Breadcrumbs')
    .render('components/views/breadcrumbs')
}

function renderLocalHeader (req, res) {
  return res
    .breadcrumb('Local header')
    .render('components/views/local-header')
}

function renderPagination (req, res) {
  return res
    .breadcrumb('Pagination')
    .render('components/views/pagination')
}

function renderResults (req, res) {
  return res
    .breadcrumb('Results')
    .render('components/views/results')
}

async function renderEntityList (req, res) {
  const investmentProjects = await authorisedRequest(req.session.token, `${config.apiRoot}/v3/investment?limit=10`)
    .then(result => {
      return Object.assign(result, {
        page: 1,
        limit: 10,
        pagination: buildPagination(req.query, result),
        items: result.results.map(transformInvestmentProjectToListItem),
      })
    })

  return res
    .breadcrumb('Entity list')
    .render('components/views/entity-list', {
      investmentProjects,
      companiesSearch: await authorisedRequest(req.session.token, `${config.apiRoot}/v3/search?term=samsung&entity=company&limit=10`),
      contactsSearch: await authorisedRequest(req.session.token, `${config.apiRoot}/v3/search?term=samsung&entity=contact&limit=10`),
    })
}

function renderProgress (req, res) {
  return res
    .breadcrumb('Progress')
    .render('components/views/progress', {
      stageNames: [
        'one',
        'two',
        'three',
        'four',
        'five',
      ],
      currentStageName: 'three',
    })
}

module.exports = {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
  renderLocalHeader,
  renderBreadcrumbs,
  renderPagination,
  renderProgress,
  renderResults,
}
