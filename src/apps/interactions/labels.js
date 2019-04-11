const interaction = {
  company: 'Company',
  subject: 'Subject',
  notes: 'Notes',
  contacts: 'Contact(s)',
  multiple_contacts: 'Multiple contacts',
  multiple_advisers: 'Multiple advisers',
  created_on: 'Created on',
  date: 'Date of interaction',
  dit_participants: 'Adviser(s)',
  service: 'Service',
  communication_channel: 'Communication channel',
  investment_project: 'Investment project',
  documents: 'Documents',
  was_policy_feedback_provided: 'Did the contact give any feedback on government policy?',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy area',
  policy_feedback_notes: 'Policy feedback notes',
}

const serviceDelivery = {
  company: 'Company',
  subject: 'Subject',
  notes: 'Notes',
  contacts: 'Contact(s)',
  date: 'Date of service delivery',
  dit_participants: 'Adviser(s)',
  service_delivery_status: 'Service status',
  grant_amount_offered: 'Grant offered',
  net_company_receipt: 'Net receipt',
  service: 'Service',
  communication_channel: 'Communication channel',
  is_event: 'Is this an event?',
  event: 'Event',
  investment_project: 'Investment project',
  documents: 'Documents',
  was_policy_feedback_provided: 'Did the contact give any feedback on government policy?',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy area',
  policy_feedback_notes: 'Policy feedback notes',
}

const filters = {
  kind: 'Kind',
  communication_channel: 'Communication channel',
  dit_participants__adviser: 'Adviser(s)',
  date_after: 'From',
  date_before: 'To',
  dit_participants__team: 'Teams',
  sector_descends: 'Sector',
  service: 'Service',
  was_policy_feedback_provided: 'Policy feedback',
  policy_areas: 'Policy areas',
  policy_issue_types: 'Policy issue type',
}

const metaItems = {
  type: 'Type',
  date: 'Date',
  contacts: 'Contact(s)',
  company: 'Company',
  dit_participants: 'Adviser(s)',
  dit_team: 'Service provider',
  service: 'Service',
}

module.exports = {
  interaction,
  serviceDelivery,
  filters,
  metaItems,
}
