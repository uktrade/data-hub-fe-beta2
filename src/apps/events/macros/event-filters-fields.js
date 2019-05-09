const { assign, flatten } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')
const { transformObjectToOption } = require('../../transformers')

const eventFiltersFields = ({ advisers, userAgent }) => {
  return [
    {
      macroName: 'TextField',
      name: 'name',
    },
    {
      macroName: 'Typeahead',
      name: 'organiser',
      entity: 'adviser',
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search organiser',
      options: advisers.results.map(transformObjectToOption),
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    assign({}, globalFields.countries, {
      name: 'address_country',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.eventTypes, {
      name: 'event_type',
      type: 'checkbox',
      modifier: 'option-select',
    }),
  ].map(filter => {
    return assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = eventFiltersFields
