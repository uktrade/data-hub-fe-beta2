const router = require('express').Router()

const { ENTITIES } = require('../search/constants')

const {
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
} = require('./controllers')

const { adviserLookup } = require('./middleware')
const { renderFormElements } = require('./form/controllers')

const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')
const { getCollection } = require('../../modules/search/middleware/collection')

router
  .get('/', renderIndex)
  .get('/breadcrumbs', renderBreadcrumbs)
  .get('/messages', renderMessages)
  .get('/entity-list', renderEntityList)
  .get('/local-header', renderLocalHeader)
  .get('/pagination', renderPagination)
  .get('/collection',
    getCollection('investment_project', ENTITIES, transformInvestmentProjectToListItem),
    renderCollection
  )
  .get('/progress', renderProgress)
  .get('/keyvaluetables', renderKeyValueTables)
  .get('/hidden-text', renderHiddenText)
  .get('/meta-list', renderMetaList)
  .all('/form', adviserLookup, renderFormElements)

module.exports = router
