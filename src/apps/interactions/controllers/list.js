const qs = require('querystring')
const { get } = require('lodash')
const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../modules/form/builders/filters')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformAdviserToOption } = require('../../adviser/transformers')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INTERACTIONS.SECTOR.NAME

const exportOptions = {
  targetPermission: 'interaction.export_interaction',
  urlFragment: 'interactions',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'interaction',
}

async function getInteractionOptions (token, req, res) {
  const currentAdviser = get(res.locals, 'interaction.dit_adviser.id')
  const sectorOptions = await getOptions(token, SECTOR, { queryString: QUERY_STRING })
  const serviceOptions = await getOptions(token, 'service', { includeDisabled: true })
  const teamOptions = await getOptions(token, 'team', { includeDisabled: true })
  const types = await getOptions(token, 'policy-issue-type')
  const advisers = await getAdvisers(token)
  const areas = await getOptions(token, 'policy-area')

  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdviser,
  })

  const adviserOptions = activeAdvisers.map(transformAdviserToOption)

  return {
    areas,
    sectorOptions,
    serviceOptions,
    teamOptions,
    adviserOptions,
    types,
  }
}

async function renderInteractionList (req, res, next) {
  try {
    const { token, user } = req.session
    const { id: currentAdviserId, permissions } = user
    const options = await getInteractionOptions(token, req, res)

    const filtersFields = collectionFilterFields({
      currentAdviserId,
      permissions,
      ...options,
      userAgent: res.locals.userAgent,
    })

    const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
    const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query, req.baseUrl)
    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    res.render('_layouts/collection', {
      selectedFiltersSummary,
      exportAction,
      filtersFields: hydratedFiltersFields,
      title: 'Interactions',
      countLabel: 'interaction',
    })
  } catch (error) {
    next(error)
  }
}

function renderInteractionsForEntity (req, res, next) {
  try {
    const { view, returnLink, createKind, canAdd } = res.locals.interactions
    const actionButtons = canAdd ? [{
      label: 'Add interaction',
      url: `${returnLink}create${createKind ? `/${createKind}` : ''}`,
    }] : undefined

    res
      .breadcrumb('Interactions')
      .render(view, {
        actionButtons,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
  renderInteractionsForEntity,
}
