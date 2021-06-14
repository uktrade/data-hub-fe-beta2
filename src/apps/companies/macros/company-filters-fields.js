const { flatten } = require('lodash')

const { globalFields } = require('../../macros')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const { QUERY_FIELDS_MAP } = require('../constants')

const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.NAME

const companyFiltersFields = function ({ sectorOptions }) {
  const countryOptions = globalFields.countries.options()
  const ukRegionOptions = globalFields.ukRegions.options()
  const usStateOptions = globalFields.usStates.options()
  const canadaProvinceOptions = globalFields.canadaProvinces.options()
  return [
    Object.assign({}, globalFields.headquarter_type, {
      name: QUERY_FIELDS_MAP.headquarterType,
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'TextField',
      label: 'Company name',
      name: QUERY_FIELDS_MAP.name,
    },
    {
      macroName: 'Typeahead',
      name: PRIMARY_SECTOR_NAME,
      isAsync: false,
      placeholder: 'Search sector',
      useSubLabel: false,
      options: sectorOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Sector',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.country,
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Country',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.area,
      isAsync: false,
      placeholder: 'Search US state',
      useSubLabel: false,
      options: usStateOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'US state',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.area,
      isAsync: false,
      placeholder: 'Search Canadian Province',
      useSubLabel: false,
      options: canadaProvinceOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Canadian Province',
    },
    {
      macroName: 'TextField',
      label: 'UK postcode',
      name: QUERY_FIELDS_MAP.ukPostcode,
      hint: 'Search multiple postcodes separated by a comma',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.ukRegion,
      isAsync: false,
      placeholder: 'Search UK region',
      useSubLabel: false,
      options: ukRegionOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'UK region',
    },
    {
      macroName: 'MultipleChoiceField',
      name: QUERY_FIELDS_MAP.archived,
      type: 'checkbox',
      label: 'Status',
      options: [
        { value: 'false', label: 'Active' },
        { value: 'true', label: 'Inactive' },
      ],
      modifier: 'option-select',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.exportingTo,
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Currently exporting to',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.interestedIn,
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Future countries of interest',
    },
    {
      macroName: 'MultipleChoiceField',
      name: QUERY_FIELDS_MAP.lastInteractionDate,
      type: 'checkbox',
      label: 'Last interaction between',
      groupClass: 'js-last-interaction-filter',
      options: [
        { value: '0', label: '0 - 1 month' },
        { value: '1', label: '1 - 3 months' },
        { value: '2', label: '3 - 6 months' },
        { value: '3', label: '6 - 12 months' },
        { value: '4', label: '12 - 24 months' },
      ],
      modifier: 'option-select',
    },
    {
      macroName: 'Typeahead',
      name: QUERY_FIELDS_MAP.leadIta,
      placeholder: 'Search adviser',
      useSubLabel: false,
      entity: 'adviser',
      hideInactive: false,
      target: 'metadata',
      label: 'Lead ITA or Global Account Manager',
    },
  ].map((filter) => {
    return Object.assign(filter, {
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = companyFiltersFields
