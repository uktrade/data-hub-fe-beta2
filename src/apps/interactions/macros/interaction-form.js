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
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'country_discussed',
        modifier: 'subfield',
        condition: {
          name: 'was_country_discussed',
          value: 'true',
        },
        children: [
          globalFields.countries,
          {
            macroName: 'MultipleChoiceField',
            type: 'radio',
            name: 'country_category',
            label: 'What type of country?',
            optional: false,
            options: [
              {
                label: 'Future country of interest',
                value: 'future_interest',
              }, {
                label: 'Currently exporting to',
                value: 'currenty_exporting',
              }, {
                label: 'Not interested',
                value: 'not_interested',
              },
            ],
          },
        ],
      },
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
