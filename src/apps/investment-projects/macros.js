const { assign, flatten } = require('lodash')

const metadata = require('../../lib/metadata')
const { globalFields } = require('../macros')
const { transformObjectToOption } = require('../transformers')
const { collectionFilterLabels, requirementsLabels } = require('./labels')

const investmentFiltersFields = function ({ currentAdviserId }) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'status',
      type: 'checkbox',
      modifier: 'option-select',
      options: metadata.investmentStatusOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'adviser',
      type: 'checkbox',
      modifier: ['option-select', 'hide-label'],
      options: [
        { value: currentAdviserId, label: 'My interactions' },
      ],
    },
    {
      macroName: 'Typeahead',
      name: 'adviser',
      entity: 'adviser',
    },
    Object.assign({}, globalFields.sectors, {
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'MultipleChoiceField',
      name: 'investor_company_country',
      type: 'checkbox',
      modifier: 'option-select',
      options () {
        return metadata.countryOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'uk_region_location',
      type: 'checkbox',
      modifier: 'option-select',
      options () {
        return metadata.regionOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'stage',
      type: 'checkbox',
      modifier: 'option-select',
      options () {
        return metadata.investmentStageOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'investment_type',
      type: 'checkbox',
      modifier: 'option-select',
      options () {
        return metadata.investmentTypeOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'TextField',
      name: 'estimated_land_date_before',
      hint: 'YYYY-MM-DD',
      placeholder: 'e.g. 2018-07-18',
    },
    {
      macroName: 'TextField',
      name: 'estimated_land_date_after',
      hint: 'YYYY-MM-DD',
      placeholder: 'e.g. 2019-05-09',
    },
    {
      macroName: 'TextField',
      name: 'actual_land_date_before',
      hint: 'YYYY-MM-DD',
      placeholder: 'e.g. 2018-07-18',
    },
    {
      macroName: 'TextField',
      name: 'actual_land_date_after',
      hint: 'YYYY-MM-DD',
      placeholder: 'e.g. 2019-05-09',
    },
  ].map(filter => {
    return Object.assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

const investmentSortForm = {
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
        { value: 'created_on:desc', label: 'Most recently created' },
        { value: 'estimated_land_date:asc', label: 'Earliest land date' },
        { value: 'estimated_land_date:desc', label: 'Latest land date' },
        { value: 'name:asc', label: 'Project name' },
        { value: 'stage.name', label: 'Stage' },
      ],
    },
  ],
}

const requirementsFormConfig = ({
  strategicDrivers,
  countries,
  ukRegions,
  partners,
}) => {
  const labels = requirementsLabels.edit

  return {
    buttonText: 'Save',
    children: [
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'strategic_drivers',
        label: requirementsLabels.edit.strategic_drivers,
        children: [
          assign({}, globalFields.strategicDrivers, {
            label: labels.strategic_drivers,
            isLabelHidden: true,
            options: strategicDrivers,
          }),
        ],
      },
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'client_requirements',
        label: labels.client_requirements,
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'client_considering_other_countries',
        label: labels.client_considering_other_countries,
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'competitor_countries',
        label: labels.competitor_countries,
        modifier: 'subfield',
        condition: {
          name: 'client_considering_other_countries',
          value: 'true',
        },
        children: [
          assign({}, globalFields.countries, {
            name: 'competitor_countries',
            label: labels.competitor_countries,
            isLabelHidden: true,
            options: countries,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'uk_region_locations',
        label: requirementsLabels.edit.uk_region_locations,
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.uk_region_locations,
            isLabelHidden: true,
            name: 'uk_region_locations',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'site_decided',
        label: labels.site_decided,
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        macroName: 'Fieldset',
        legend: 'Address',
        condition: {
          name: 'site_decided',
          value: 'true',
        },
        children: [
          {
            macroName: 'TextField',
            name: 'address_1',
            label: requirementsLabels.edit.address_1,
            modifier: 'compact',
          },
          {
            macroName: 'TextField',
            name: 'address_2',
            label: requirementsLabels.edit.address_2,
            isLabelHidden: true,
            modifier: 'compact',
          },
          {
            macroName: 'TextField',
            name: 'address_town',
            label: requirementsLabels.edit.address_town,
          },
          {
            macroName: 'TextField',
            name: 'address_postcode',
            label: requirementsLabels.edit.address_postcode,
            modifier: 'short',
          },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'actual_uk_regions',
        label: requirementsLabels.edit.actual_uk_regions,
        condition: {
          name: 'site_decided',
          value: 'true',
        },
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.actual_uk_regions,
            isLabelHidden: true,
            name: 'actual_uk_regions',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'delivery_partners',
        children: [{
          macroName: 'MultipleChoiceField',
          name: 'delivery_partners',
          label: labels.delivery_partners,
          isLabelHidden: true,
          options: partners,
          initialOption: '-- Select a partner --',
        }],
      },
    ].map(field => {
      return assign(field, {
        label: requirementsLabels.edit[field.name],
      })
    }),
  }
}

const statusFormConfig = {
  buttonText: 'Save',
  children: [{
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'status',
    label: 'Status',
    isLabelHidden: true,
    options: metadata.investmentStatusOptions,
  }],
}

module.exports = {
  investmentFiltersFields,
  investmentSortForm,
  requirementsFormConfig,
  statusFormConfig,
}
