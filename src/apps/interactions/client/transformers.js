/* eslint-disable camelcase */
const { get } = require('lodash')

const { format } = require('../../../client/utils/date-utils')
const urls = require('../../../lib/urls')

const formatContacts = (contacts) =>
  contacts.length > 1
    ? 'Multiple contacts'
    : contacts.map((contact) => getContactName(contact))

const getContactName = (contact) =>
  get(contact, 'name') ? contact.name : 'Unknown contact'

const formatParticipantName = (participant) =>
  get(participant, 'adviser') && get(participant, 'team')
    ? `${participant.adviser.name}, ${participant.team.name}`
    : get(participant, 'adviser')
    ? participant.adviser.name
    : 'Unknown adviser'

const formatParticipants = (dit_participants) =>
  dit_participants.length > 1
    ? 'Multiple advisers'
    : dit_participants.map((participant) => formatParticipantName(participant))

const getbadgeLabel = (type, hasFeedback = false) => {
  const badges = {
    interaction: 'Interaction',
    service_delivery: 'Service delivery',
  }
  return [
    {
      text: badges[type],
    },
    hasFeedback && {
      text: 'Business intelligence',
    },
  ].filter(Boolean)
}

export const transformInteractionToListItem = ({
  date,
  subject,
  dit_participants,
  service,
  company,
  id,
  contacts,
  kind,
  was_policy_feedback_provided,
} = {}) => ({
  id,
  metadata: [
    { label: 'Date', value: format(date, 'dd MMMM yyyy') },
    {
      label: 'Contact(s)',
      value: contacts && formatContacts(contacts),
    },
    { label: 'Company', value: company?.name },
    {
      label: 'Adviser(s)',
      value: dit_participants && formatParticipants(dit_participants),
    },
    {
      label: 'Service',
      value: service?.name,
    },
  ].filter(({ value }) => Boolean(value)),
  headingUrl: urls.interactions.detail(id),
  badges: getbadgeLabel(kind, was_policy_feedback_provided),
  headingText: subject,
})

export const transformResponseToCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformInteractionToListItem),
})
