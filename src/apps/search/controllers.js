const { get, find } = require('lodash')

const { ENTITIES } = require('./constants')
const { search } = require('../../modules/search/services')
const {
  transformApiResponseToSearchCollection,
} = require('../../modules/search/transformers')
const { transformCompanyToListItem } = require('../companies/transformers')
const { transformContactToListItem } = require('../contacts/transformers')
const { transformEventToListItem } = require('../events/transformers')
const {
  transformInvestmentProjectToListItem,
} = require('../investments/transformers')
const { transformOrderToListItem } = require('../omis/transformers')
const {
  transformInteractionToListItem,
} = require('../interactions/transformers')
const { transformFullExportHistory } = require('./transformers')
const { fetchFullExportHistory } = require('./repos')

async function renderSearchResults(req, res) {
  const entity = find(ENTITIES, ['path', req.params.searchPath])

  if (!entity) {
    return res.render('search/view')
  }

  const actionButtons = []
  const searchTerm = get(req, 'query.term', '').trim()
  const searchEntity = entity.entity
  const itemTransformers = []

  if (searchEntity === 'investment_project') {
    itemTransformers.push(transformInvestmentProjectToListItem)
  }
  if (searchEntity === 'contact') {
    itemTransformers.push(transformContactToListItem)
  }
  if (searchEntity === 'event') {
    itemTransformers.push(transformEventToListItem)
    actionButtons.push({
      label: 'Add event',
      url: '/events/create',
    })
  }
  if (searchEntity === 'order') {
    itemTransformers.push(transformOrderToListItem)
    actionButtons.push({
      label: 'Add order',
      url: '/omis/create',
    })
  }

  if (searchEntity === 'company') {
    itemTransformers.push(transformCompanyToListItem)
    actionButtons.push({
      label: 'Add company',
      url: '/companies/create',
    })
  }

  if (searchEntity === 'interaction') {
    itemTransformers.push(transformInteractionToListItem())
  }

  const results = await search({
    searchTerm,
    searchEntity,
    requestBody: req.body,
    token: req.session.token,
    page: req.query.page,
  }).then(
    transformApiResponseToSearchCollection(
      {
        searchTerm,
        query: req.query,
        userPermissions: get(res, 'locals.user.permissions'),
      },
      ENTITIES,
      ...itemTransformers
    )
  )

  res.breadcrumb(entity.text).render('search/view', {
    actionButtons,
    searchEntity,
    searchTerm,
    results,
  })
}

async function fetchFullExportHistoryHandler(req, res, next) {
  try {
    const { token } = req.session
    const { page, companyId } = req.query

    const { count, results } = await fetchFullExportHistory(
      token,
      10,
      parseInt(page, 10),
      companyId
    )

    res.json({
      count: count || 0,
      results: results ? transformFullExportHistory(results) : [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderSearchResults,
  fetchFullExportHistoryHandler,
}
