const { flatten } = require('lodash')

const { globalFields } = require('../../macros')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const { QUERY_FIELDS_MAP } = require('../constants')

const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.NAME

const companyFiltersFields = function ({ sectorOptions }) {
  const countryOptions = globalFields.countries.options()
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
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
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
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Country',
    },
    Object.assign({}, globalFields.ukRegions, {
      name: QUERY_FIELDS_MAP.ukRegion,
      type: 'checkbox',
      modifier: 'option-select',
    }),
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
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Currently exporting to',
    },
    {
      macroName: 'ReactTypeahead',
      name: QUERY_FIELDS_MAP.interestedIn,
      isAsync: false,
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search country',
      useSubLabel: false,
      options: countryOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Future markets of interest',
    },
  ].map(filter => {
    return Object.assign(filter, {
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = companyFiltersFields
