const path = require('path')
const qs = require('querystring')
const { get, set } = require('lodash')
const { collectionFilterFields } = require('../macros')
const {
  buildSelectedFiltersSummary,
  buildFieldsWithSelectedEntities,
} = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { saveSession } = require('../../../lib/session-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INTERACTIONS.SECTOR.NAME

const exportOptions = {
  targetPermission: 'interaction.export_interaction',
  urlFragment: 'interactions',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'interaction',
}

const filterServiceNames = (services) => {
  if (!services) return

  const excludedServiceStrings = [
    'A Specific DIT Export Service or Funding',
    'A Specific Service',
    'Enquiry or Referral Received',
    'Enquiry Received',
  ]

  const filteredServiceNames = services
    .map((service) => {
      const splitServiceName = service.label.split(' : ')
      const name =
        splitServiceName[1] &&
        excludedServiceStrings.includes(splitServiceName[0])
          ? splitServiceName[1]
          : service.label
      return { ...service, label: name }
    })
    .sort(function(a, b) {
      const textA = a.label
      const textB = b.label

      return textA.localeCompare(textB)
    })

  return filteredServiceNames
}

async function getInteractionOptions(token, req, res) {
  if (req.xhr && get(req.session, 'interactions.options')) {
    return req.session.interactions.options
  }
  const sectorOptions = await getOptions(token, SECTOR, {
    queryString: QUERY_STRING,
  })

  const unfilteredServiceOptions = await getOptions(token, 'service', {
    includeDisabled: true,
  })

  const serviceOptions = filterServiceNames(unfilteredServiceOptions)

  const teamOptions = await getOptions(token, 'team', { includeDisabled: true })
  const types = await getOptions(token, 'policy-issue-type')

  const areas = await getOptions(token, 'policy-area')
  const oneListTierOptions = await getOptions(token, 'one-list-tier')

  const currentAdvisers =
    get(res.locals, 'interaction.dit_participants') &&
    res.locals.interaction.dit_participants.map(
      (participant) => participant.adviser && participant.adviser.id
    )

  const advisers = await getAdvisers(token)

  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdvisers,
  })

  const adviserOptions = activeAdvisers.map(transformAdviserToOption)

  const interactionOptions = {
    areas,
    sectorOptions,
    serviceOptions,
    teamOptions,
    adviserOptions,
    oneListTierOptions,
    types,
  }

  set(req.session, 'interactions.options', interactionOptions)
  await saveSession(req.session)

  return interactionOptions
}

async function renderInteractionList(req, res, next) {
  try {
    const { token, user } = req.session
    const { id: currentAdviserId, permissions } = user
    const { query } = req
    const options = await getInteractionOptions(token, req, res)

    const filtersFields = collectionFilterFields({
      currentAdviserId,
      permissions,
      ...options,
      userAgent: res.locals.userAgent,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(
      token,
      filtersFields,
      query
    )
    const selectedFilters = await buildSelectedFiltersSummary(
      filtersFieldsWithSelectedOptions,
      query
    )
    const exportAction = await buildExportAction(
      qs.stringify(req.query),
      user.permissions,
      exportOptions
    )

    res.render('interactions/apps/collection/views/list.njk', {
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

function renderInteractionsForEntity(req, res, next) {
  try {
    const {
      view,
      returnLink,
      createKind,
      canAdd,
      theme = '',
    } = res.locals.interactions
    const actionButtons = canAdd
      ? [
          {
            label: 'Add interaction',
            url: path.join(
              returnLink,
              '/create',
              createKind ? `/${theme}/${createKind}` : ''
            ),
          },
        ]
      : undefined

    res.breadcrumb('Interactions').render(view, {
      actionButtons,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
  renderInteractionsForEntity,
  getInteractionOptions,
}
