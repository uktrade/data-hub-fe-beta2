module.exports = {
  contact (contacts) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'contact',
      initialOption: '-- Select contact --',
      options: contacts,
    }
  },
  provider (teams) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_team',
      initialOption: '-- Select provider --',
      options: teams,
    }
  },
  service (services) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'service',
      initialOption: '-- Select service --',
      options: services,
    }
  },
  policyIssueType (types) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'policy_issue_type',
      initialOption: '-- Select policy issue --',
      options: types,
    }
  },
  policyArea (areas) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'policy_area',
      initialOption: '-- Select policy area --',
      options: areas,
    }
  },
  subject: {
    macroName: 'TextField',
    name: 'subject',
  },
  notes: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'notes',
  },
  date: {
    macroName: 'DateFieldset',
    name: 'date',
  },
  adviser (advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_adviser',
      initialOption: '-- Select adviser --',
      options: advisers,
    }
  },
  communicationChannel (channels) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'communication_channel',
      initialOption: '-- Select communication channel --',
      options: channels,
    }
  },
}
