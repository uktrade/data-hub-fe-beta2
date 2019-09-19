const interaction = {
  company: 'Company',
  contacts: 'Contact(s)',
  service: 'Service',
  subject: 'Subject',
  notes: 'Notes',
  date: 'Date of interaction',
  dit_participants: 'Adviser(s)',
  investment_project: 'Investment project',
  communication_channel: 'Communication channel',
  documents: 'Documents',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy area',
  policy_feedback_notes: 'Policy feedback notes',
  multiple_contacts: 'Multiple contacts',
  multiple_advisers: 'Multiple advisers',
  created_on: 'Created on',
  was_policy_feedback_provided:
    'Did the contact give any feedback on government policy?',
  service_delivery_status: 'Service status',
  grant_amount_offered: 'Grant offered',
}

const serviceDelivery = {
  company: 'Company',
  contacts: 'Contact(s)',
  service: 'Service',
  service_delivery_status: 'Service status',
  grant_amount_offered: 'Grant offered',
  net_company_receipt: 'Net receipt',
  subject: 'Subject',
  notes: 'Notes',
  date: 'Date of service delivery',
  dit_participants: 'Adviser(s)',
  investment_project: 'Investment project',
  event: 'Event',
  communication_channel: 'Communication channel',
  documents: 'Documents',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy area',
  policy_feedback_notes: 'Policy feedback notes',
  is_event: 'Is this an event?',
  was_policy_feedback_provided:
    'Did the contact give any feedback on government policy?',
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
  company_one_list_group_tier: 'Company One List Group Tier',
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
