const bodybuilder = require('bodybuilder')

const { FILTER_KEYS, ES_KEYS_GROUPED } = require('./constants')

const { allActivity, externalActivity, dataHubActivity } = ES_KEYS_GROUPED

const FILTER_KEY_MAP = {
  [FILTER_KEYS.allActivity]: allActivity,
  [FILTER_KEYS.externalActivity]: externalActivity,
  [FILTER_KEYS.dataHubActivity]: dataHubActivity,
}

function createESFilters(
  activityTypeFilter,
  dnbHierarchyIds = [],
  company,
  user,
  from,
  size
) {
  const types =
    FILTER_KEY_MAP[activityTypeFilter] ||
    FILTER_KEY_MAP[FILTER_KEYS.dataHubActivity]

  const body = bodybuilder()
    .from(from)
    .size(size)
    .sort('object.startTime', 'desc')

  // Add the types
  body.filter('terms', 'object.type', types)

  const filters = []
  // My activity
  if (activityTypeFilter === FILTER_KEYS.myActivity) {
    filters.push({
      term: { 'object.attributedTo.id': `dit:DataHubAdviser:${user.id}` },
    })
  }

  // DnB Hierarchy IDs and Data Hub Company ID
  if (dnbHierarchyIds.length) {
    const ids = dnbHierarchyIds.map((id) => `dit:DataHubCompany:${id}`)
    ids.push(`dit:DataHubCompany:${company.id}`)
    filters.push({ terms: { 'object.attributedTo.id': ids } })
  } else {
    filters.push({
      term: { 'object.attributedTo.id': `dit:DataHubCompany:${company.id}` },
    })
  }

  if (company.contacts) {
    company.contacts.map((contact) => {
      filters.push({ term: { 'object.dit:emailAddress': contact.email } })
      filters.push({ term: { 'actor.dit:emailAddress': contact.email } })
    })
  }
  body.filter('bool', 'should', filters)

  return body.build()
}

module.exports = {
  createESFilters,
}
