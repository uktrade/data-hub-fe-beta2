const { flatten } = require('lodash')

const { ORDER_STATES } = require('../../constants')

const omisFiltersFields = function ({
  omisMarketOptions,
  regionOptions,
  sectorOptions,
  userAgent,
}) {
  return [
    {
      macroName: 'MultipleChoiceField',
      label: 'Order status',
      name: 'status',
      type: 'checkbox',
      modifier: 'option-select',
      options: ORDER_STATES,
    },
    {
      macroName: 'TextField',
      label: 'Order reference',
      name: 'reference',
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Completed date from',
      name: 'completed_on_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Completed date to',
      name: 'completed_on_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Expected delivery date from',
      name: 'delivery_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Expected delivery date to',
      name: 'delivery_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'TextField',
      label: 'Company name',
      name: 'company_name',
    },
    {
      macroName: 'TextField',
      label: 'Contact name',
      name: 'contact_name',
    },
    {
      macroName: 'MultipleChoiceField',
      label: 'Market (country)',
      name: 'primary_market',
      type: 'checkbox',
      modifier: 'option-select',
      options: omisMarketOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      label: 'UK region',
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
      options: regionOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      label: 'Sector',
      name: 'sector_descends',
      type: 'checkbox',
      modifier: 'option-select',
      options: sectorOptions,
    },
  ].map(filter => {
    return {
      ...filter,
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    }
  })
}

const collectionSortForm = {
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
      inputClass: 'js-MirrorValue',
      inputData: {
        'target-selector': '.c-collection-filters input[name="sortby"]',
      },
      options: [
        { value: 'created_on:desc', label: 'Newest' },
        { value: 'created_on:asc', label: 'Oldest' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'delivery_date:asc', label: 'Earliest delivery date' },
        { value: 'delivery_date:desc', label: 'Latest delivery date' },
      ],
    },
  ],
}

module.exports = {
  collectionSortForm,
  omisFiltersFields,
}
