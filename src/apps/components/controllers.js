const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

const { buildPagination } = require('../../lib/pagination')
const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')

function renderIndex (req, res) {
  return res.render('components/views/index', {
    title: 'Data Hub Components',
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

function renderCollection (req, res) {
  return res
    .breadcrumb('Collection')
    .render('components/views/collection')
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

  const auditLog = {
    items: [{
      type: 'audit',
      name: '20 December 2016 9:00am',
      contentMetaModifier: 'stacked',
      meta: [{
        label: 'Advisor',
        value: 'Fred Smith',
      }, {
        label: 'Change count',
        type: 'badge',
        value: '2 changes',
      }, {
        label: 'Fields',
        value: 'Name',
      }],
    }],
    count: 1,
  }

  return res
    .breadcrumb('Entity list')
    .render('components/views/entity-list', {
      investmentProjects,
      auditLog,
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

function renderKeyValueTables (req, res) {
  const tableData = {
    'Company': 'Acme corp',
    'Something': {
      name: 'Else',
      url: '/components/',
    },
    'Date': {
      type: 'date',
      name: '20170107',
    },
    'Region': {
      id: '1234',
      name: 'South',
    },
    'Flavours': ['Chocolate', 'Strawberry', 'Melon'],
    'Related Company': {
      name: 'Freds Bananas',
      actions: [{
        url: '/components/',
        label: 'Add company',
      }, {
        url: '/components/',
        label: 'Remove company',
      }],
    },
  }

  return res
    .breadcrumb('Key Value Tables')
    .render('components/views/keyvaluetables', {
      tableData,
    })
}

function renderHiddenText (req, res) {
  return res
    .breadcrumb('Hidden text')
    .render('components/views/hidden-text')
}

function renderMetaList (req, res) {
  return res
    .breadcrumb('Meta list')
    .render('components/views/meta-list', {
      meta: [
        {
          label: 'Status',
          value: 'Ongoing',
          url: '/investment-projects/5d341b34-1fc8-4638-b4b1-a0922ebf401e/status',
          urlLabel: 'change',
        },
        { label: 'Project code', value: 'DHP-00000009' },
        { label: 'Valuation', value: 'Not yet valued' },
        { label: 'Created on', value: '5 Jan 2016, 3:00pm' },
      ],
    })
}

module.exports = {
  renderEntityList,
  renderIndex,
  renderMessages,
  renderLocalHeader,
  renderBreadcrumbs,
  renderPagination,
  renderProgress,
  renderCollection,
  renderKeyValueTables,
  renderHiddenText,
  renderMetaList,
}
