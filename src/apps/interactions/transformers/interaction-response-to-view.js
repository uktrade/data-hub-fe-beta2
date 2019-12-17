/* eslint-disable camelcase */
const { camelCase, pickBy, get } = require('lodash')

const config = require('../../../config')
const labels = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')

function transformEntityLink (entity, entityPath, noLinkText = null) {
  return entity
    ? {
      url: `/${entityPath}/${entity.id}`,
      name: entity.name,
    }
    : noLinkText
}

function transformDocumentsLink (archived_documents_url_path) {
  if (archived_documents_url_path) {
    return {
      url: config.archivedDocumentsBaseUrl + archived_documents_url_path,
      name: 'View files and documents',
      hint: '(will open another website)',
      hintId: 'external-link-label',
    }
  }

  return { name: 'There are no files or documents' }
}

function formatParticipantName (participant) {
  return get(participant, 'team')
    ? `${participant.adviser.name}, ${participant.team.name}`
    : participant.adviser.name
}

const excludedServiceStrings = [
  'A Specific DIT Export Service or Funding',
  'A Specific Service',
  'Enquiry or Referral Received',
  'Enquiry Received',
]

function getServiceValues (service) {
  if (!service) return

  const splitServiceName = service.name.split(' : ')
  const serviceName =
    splitServiceName[1] &&
    excludedServiceStrings.includes(splitServiceName[0])
      ? splitServiceName[1]
      : service.name

  return {
    ...service,
    name: serviceName,
  }
}

function getName (obj) {
  return obj.name
}

function getNames (arr = []) {
  return arr.map(getName).join(', ')
}

function getCurrency (item) {
  if (item) {
    return {
      type: 'currency',
      name: item,
    }
  }

  return null
}

function transformInteractionResponseToViewRecord (
  {
    company,
    notes,
    date,
    dit_participants,
    service = {},
    service_delivery_status,
    grant_amount_offered,
    net_company_receipt,
    contacts,
    policy_areas,
    policy_issue_types,
    policy_feedback_notes,
    investment_project,
    communication_channel,
    event,
    kind,
    archived_documents_url_path,
  },
  canShowDocuments = false
) {
  const defaultEventText = kind === 'service_delivery' ? 'No' : null
  const kindLabels = labels[camelCase(kind)]

  const viewRecord = {
    company: transformEntityLink(company, 'companies'),
    contacts: contacts.map(contact => transformEntityLink(contact, 'contacts')),
    service: getServiceValues(service),
    service_delivery_status,
    grant_amount_offered: getCurrency(grant_amount_offered),
    net_company_receipt: getCurrency(net_company_receipt),
    notes: notes,
    date: { type: 'date', name: date },
    dit_participants: (dit_participants || []).map(formatParticipantName),
    investment_project: transformEntityLink(
      investment_project,
      'investments/projects'
    ),
    event: transformEntityLink(event, 'events', defaultEventText),
    communication_channel: communication_channel,
    documents: canShowDocuments
      ? transformDocumentsLink(archived_documents_url_path)
      : null,
    policy_issue_types: getNames(policy_issue_types),
    policy_areas: getNames(policy_areas),
    policy_feedback_notes: policy_feedback_notes,
  }

  return pickBy(getDataLabels(viewRecord, kindLabels))
}

module.exports = transformInteractionResponseToViewRecord
