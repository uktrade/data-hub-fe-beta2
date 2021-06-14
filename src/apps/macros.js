const { sortBy } = require('lodash')
const metadata = require('../lib/metadata')
const {
  transformObjectToOption,
  transformStringToOption,
  transformHQCodeToLabelledOption,
} = require('./transformers')
const { US_COUNTRY_ID, CANADA_COUNTRY_ID } = require('./constants.js')

const foreignOtherCompanyOptions = [
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

const globalFields = {
  countries: {
    macroName: 'MultipleChoiceField',
    name: 'country',
    label: 'Country',
    initialOption: '-- Select country --',
    options() {
      return metadata.countryOptions.map(transformObjectToOption)
    },
  },

  ukRegions: {
    macroName: 'MultipleChoiceField',
    name: 'uk_region',
    label: 'UK Region',
    initialOption: '-- Select region --',
    options() {
      return metadata.regionOptions.map(transformObjectToOption)
    },
  },

  usStates: {
    macroName: 'MultipleChoiceField',
    name: 'us_state',
    label: 'US State',
    initialOption: '-- Select US state --',
    options() {
      return metadata.administrativeAreaOptions
        .filter((states) => states.country.id === US_COUNTRY_ID)
        .map(transformObjectToOption)
    },
  },

  canadaProvinces: {
    macroName: 'MultipleChoiceField',
    name: 'canada_province',
    label: 'Canadian Province',
    initialOption: '-- Select Canadian Province --',
    options() {
      return metadata.administrativeAreaOptions
        .filter((states) => states.country.id === CANADA_COUNTRY_ID)
        .map(transformObjectToOption)
    },
  },

  headquarter_type: {
    macroName: 'MultipleChoiceField',
    name: 'headquarter_type',
    type: 'checkbox',
    label: 'Type',
    options() {
      return sortBy(
        metadata.headquarterOptions.map(transformHQCodeToLabelledOption),
        ['order', 'label', 'value']
      )
    },
  },

  sectors: {
    macroName: 'MultipleChoiceField',
    name: 'sector_descends',
    label: 'Sectors',
    initialOption: '-- Select sector --',
    options() {
      return metadata.sectorOptions.map(transformObjectToOption)
    },
  },

  strategicDrivers: {
    macroName: 'MultipleChoiceField',
    name: 'strategic_drivers',
    label: 'Strategic drivers',
    initialOption: '-- Select strategic driver --',
    options() {
      return metadata.strategicDriverOptions.map(transformObjectToOption)
    },
  },

  averageSalary: {
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'average_salary',
    label: 'Average salary range',
    options() {
      return metadata.salaryRangeOptions.map(transformObjectToOption)
    },
  },

  foreignOtherCompany: {
    macroName: 'MultipleChoiceField',
    name: 'foreign_other_company',
    label: 'Type of organisation',
    initialOption: '-- Select organisation type --',
    options() {
      return foreignOtherCompanyOptions.map(transformStringToOption)
    },
  },

  eventTypes: {
    macroName: 'MultipleChoiceField',
    name: 'event_type',
    label: 'Type of event',
    initialOption: '-- Select event type --',
    options() {
      return metadata.eventTypeOptions.map(transformObjectToOption)
    },
  },

  locationTypes: {
    macroName: 'MultipleChoiceField',
    name: 'location_type',
    label: 'Location type',
    initialOption: '-- Select event --',
    options() {
      return metadata.locationTypeOptions.map(transformObjectToOption)
    },
  },

  serviceDeliveryServices: {
    macroName: 'MultipleChoiceField',
    name: 'service',
    label: 'Service',
    initialOption: '-- Select service --',
    options() {
      return metadata.serviceDeliveryServiceOptions.map(transformObjectToOption)
    },
  },

  teams: {
    macroName: 'MultipleChoiceField',
    name: 'team',
    label: 'Team',
    initialOption: '-- Select team --',
    options() {
      return metadata.teams.map(transformObjectToOption)
    },
  },

  programmes: {
    macroName: 'MultipleChoiceField',
    name: 'programme',
    label: 'Programme',
    initialOption: '-- Select programme --',
    options() {
      return metadata.programmeOptions.map(transformObjectToOption)
    },
  },

  tradeAgreements: {
    macroName: 'MultipleChoiceField',
    name: 'related_trade_agreements',
    label: 'Related Trade Agreements',
    initialOption: '-- Select related trade agreement --',
    options() {
      return metadata.tradeAgreementOptions.map(transformObjectToOption)
    },
  },
}

module.exports = {
  globalFields,
}
