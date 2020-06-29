var pipelineItemLambdaPlc = require('../../../fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
var pipelineNoResult = require('../../../fixtures/v4/pipeline-item/pipeline-item-no-results.json')
var pipelineCreate = require('../../../fixtures/v4/pipeline-item/pipeline-item-create.json')
var lambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')
var leads = require('../../../fixtures/v4/pipeline-item/leads.json')
var inProgress = require('../../../fixtures/v4/pipeline-item/in-progress.json')
var win = require('../../../fixtures/v4/pipeline-item/win.json')
const archived = require('../../../fixtures/v4/pipeline-item/archived.json')
const { sortBy } = require('lodash')

function createItem(status) {
  return {
    ...pipelineCreate,
    status,
  }
}

exports.getPipelineItems = function(req, res) {
  let result = pipelineNoResult
  if (req.query.company_id === lambdaPlc.id) {
    res.json(pipelineItemLambdaPlc)
    return
  }

  if (req.query.status === 'leads') {
    result = { ...leads }
  }
  if (req.query.status === 'in_progress') {
    result = { ...inProgress }
  }
  if (req.query.status === 'win') {
    result = { ...win }
  }

  if (req.query.archived === 'false') {
    result.results = result.results.filter((item) => !item.archived)
  }
  if (req.query.sortby) {
    let sortByQuery = req.query.sortby
    let reverse = false
    if (sortByQuery[0] === '-') {
      reverse = true
      sortByQuery = sortByQuery.substring(1)
    }
    const sortedResults = sortBy(result.results, [sortByQuery])
    result.results = reverse ? sortedResults.reverse() : sortedResults
  }

  res.json(result)
  return
}

exports.createUpdatePipelineItem = function(req, res) {
  var company = _.assign({}, pipelineCreate.company, {
    id: lambdaPlc.id,
    name: lambdaPlc.name,
  })
  var json = _.assign({}, pipelineCreate, {
    status: req.body.status,
    name: req.body.name,
    company: company,
  })
  res.json(json)
}

exports.getPipelineItem = function(req, res) {
  var pipelineId = req.params.pipelineItemId
  var lambdaItemOne = pipelineItemLambdaPlc.results[0]
  var lambdaItemTwo = pipelineItemLambdaPlc.results[1]

  if (pipelineId === lambdaItemOne.id) {
    return res.json(lambdaItemOne)
  }

  if (pipelineId === lambdaItemTwo.id) {
    return res.json(lambdaItemTwo)
  }

  if (pipelineId === 'LEADS') {
    return res.json(createItem('leads'))
  }

  if (pipelineId === 'IN_PROGRESS') {
    return res.json(createItem('in_progress'))
  }

  if (pipelineId === 'WIN') {
    return res.json(createItem('win'))
  }

  if (pipelineId === 'ARCHIVED') {
    return res.json(archived)
  }

  res.sendStatus(404)
}

exports.archivePipelineItem = function(req, res) {
  const { pipelineItemId } = req.params

  if (pipelineItemId === 'LEADS') {
    return res.json(createItem('leads'))
  }

  if (pipelineItemId === 'IN_PROGRESS') {
    return res.json(createItem('in_progress'))
  }

  if (pipelineItemId === 'WIN') {
    return res.json(createItem('win'))
  }

  res.sendStatus(200)
}

exports.unarchivePipelineItem = function(req, res) {
  const { pipelineItemId } = req.params

  if (pipelineItemId === 'LEADS') {
    return res.json(createItem('leads'))
  }

  if (pipelineItemId === 'IN_PROGRESS') {
    return res.json(createItem('in_progress'))
  }

  if (pipelineItemId === 'WIN') {
    return res.json(createItem('win'))
  }

  res.sendStatus(200)
}

exports.deletePipelineItem = function(req, res) {
  res.sendStatus(204)
}
