const { assign } = require('lodash')
const { globalFields } = require('../../macros')

const labels = require('../labels')
const {
  contact,
  communicationChannel,
  service,
  subject,
  notes,
  date,
  serviceHeading,
  participantsHeading,
  detailsHeading,
  notesHeading,
  adviser,
  policyAreas,
  feedbackPolicyRequest,
  feedbackPolicyIssueType,
  feedbackPolicyNotes,
} = require('./fields')

function addCountriesDiscussed (featureFlags) {
  if (!featureFlags['interaction-add-countries']) {
    return []
  } else {
    return [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'was_country_discussed',
        modifier: 'inline',
        optional: false,
        options: [
          {
            label: 'Yes',
            value: 'true',
          },
          {
            label: 'No',
            value: 'false',
          },
        ],
      },
      ...[
        'future_countries',
        'export_countries',
        'no_interest_countries',
      ].map((name) => ({
        macroName: 'Typeahead',
        name,
        hint: 'Add all that you discussed',
        modifier: 'subfield',
        condition: {
          name: 'was_country_discussed',
          value: 'true',
        },
        isAsync: false,
        isLabelHidden: false,
        useSubLabel: false,
        placeholder: 'Search countries',
        classes: 'c-form-group--no-filter',
        multipleSelect: true,
        options: globalFields.countries.options(),
        target: 'metadata',
      })),
    ]
  }
}

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  contacts = [],
  services = [],
  channels = [],
  advisers = [],
  hiddenFields,
  areas,
  types,
  company,
  featureFlags,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields,
    children: [
      serviceHeading,
      ...service(services),
      participantsHeading(company),
      contact(contacts),
      adviser(advisers),
      detailsHeading,
      date,
      communicationChannel(channels),
      notesHeading,
      subject,
      notes,
      feedbackPolicyRequest,
      feedbackPolicyIssueType(types),
      {
        ...policyAreas(areas),
        modifier: 'subfield',
        condition: {
          name: 'was_policy_feedback_provided',
          value: 'true',
        },
      },
      feedbackPolicyNotes,
      ...addCountriesDiscussed(featureFlags),
    ].map(field => {
      return assign(field, {
        label: field.label || labels.interaction[field.name],
      })
    }),
  }
}
