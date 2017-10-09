const formLabels = require('./labels')
const metaData = require('../../lib/metadata')
const { transformContactToOption, transformObjectToOption } = require('../transformers')

const interactionSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'date:desc', label: 'Newest' },
        { value: 'date:asc', label: 'Oldest' },
        { value: 'company.name:asc', label: 'Company: A-Z' },
        { value: 'company.name:desc', label: 'Company: Z-A' },
        { value: 'contact.name:asc', label: 'Contact: A-Z' },
        { value: 'contact.name:desc', label: 'Contact: Z-A' },
        { value: 'dit_adviser.name:asc', label: 'Adviser: A-Z' },
        { value: 'dit_adviser.name:desc', label: 'Adviser: Z-A' },
        { value: 'subject:asc', label: 'Subject: A-Z' },
        { value: 'subject:desc', label: 'Subject: Z-A' },
      ],
    },
  ],
}

const selectKindFormConfig = function ({
  returnLink,
  errors = [],
}) {
  return {
    buttonText: 'Continue',
    errors: errors,
    children: [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        label: 'What type of interaction would you like to record?',
        name: 'kind',
        options: [{
          value: 'interaction',
          label: 'A standard interaction',
          hint: 'For example, an email, phone call or meeting',
        }, {
          value: 'service_delivery',
          label: 'A service that you have provided (delivered)',
          hint: 'For example, a significant assist or outward mission',
        }],
      },
    ],
  }
}

const interactionEditFormConfig = function ({
  returnLink,
  id,
  contacts = [],
  advisers = [],
  services = [],
  communicationChannelOptions = [],
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    hiddenFields: {
      id,
    },
    children: [
      {
        macroName: 'MultipleChoiceField',
        name: 'communication_channel',
        label: 'Communication channel',
        initialOption: '-- Select method --',
        options () {
          return communicationChannelOptions.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'contact',
        label: formLabels.contact,
        initialOption: '-- Select contact --',
        options () {
          return contacts.map(transformContactToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'dit_team',
        label: formLabels.dit_team,
        initialOption: '-- Select provider --',
        options () {
          return metaData.teams.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'service',
        label: formLabels.service,
        initialOption: '-- Select service --',
        options () {
          return services.map(transformObjectToOption)
        },
      },
      {
        macroName: 'TextField',
        name: 'subject',
        label: formLabels.subject,
      },
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'notes',
        label: formLabels.notes,
      },
      {
        macroName: 'DateFieldset',
        name: 'date',
        label: formLabels.date,
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'dit_adviser',
        label: formLabels.dit_adviser,
        optional: true,
        initialOption: '-- Select adviser --',
        options () {
          return advisers.map(transformContactToOption)
        },
      },
    ],
  }
}

module.exports = {
  interactionSortForm,
  interactionEditFormConfig,
  selectKindFormConfig,
}
