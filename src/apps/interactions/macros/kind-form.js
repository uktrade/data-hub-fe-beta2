const { POLICY_FEEDBACK_PERMISSIONS } = require('../constants')

module.exports = function ({
  returnLink,
  errors = [],
  permissions = [],
}) {
  const options = [
    {
      value: 'interaction',
      label: 'A standard interaction',
      hint: 'For example, an email, phone call or meeting',
    }, {
      value: 'service_delivery',
      label: 'A service that you have provided',
      hint: 'For example, account management, a significant assist or an event',
    },
  ]

  if (permissions.includes(POLICY_FEEDBACK_PERMISSIONS.create)) {
    options.push({
      value: 'policy_feedback',
      label: 'Capture policy feedback',
      hint: 'For example, an issue or comment on government policy from a company',
    })
  }

  return {
    buttonText: 'Continue',
    errors,
    children: [{
      options,
      macroName: 'MultipleChoiceField',
      type: 'radio',
      label: 'What would you like to record?',
      name: 'kind',
    }],
  }
}
