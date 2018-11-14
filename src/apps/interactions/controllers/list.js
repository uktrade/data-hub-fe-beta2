const qs = require('querystring')
const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INTERACTIONS.SECTOR.NAME

const exportOptions = {
  targetPermission: 'interaction.export_interaction',
  urlFragment: 'interactions',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'interaction',
}

async function getInteractionOptions (token) {
  const sectorOptions = await getOptions(token, SECTOR, { queryString: QUERY_STRING })
  const serviceOptions = await getOptions(token, 'service', { includeDisabled: true })
  const teamOptions = await getOptions(token, 'team', { includeDisabled: true })

  return {
    sectorOptions,
    serviceOptions,
    teamOptions,
  }
}

async function renderInteractionList (req, res, next) {
  try {
    const { token, user } = req.session
    const { id: currentAdviserId, permissions } = user
    const { query } = req

    const options = await getInteractionOptions(token)

    const filtersFields = collectionFilterFields({
      currentAdviserId,
      permissions,
      ...options,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, query)
    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    res.render('_layouts/collection', {
      selectedFilters,
      exportAction,
      filtersFields: filtersFieldsWithSelectedOptions,
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
