import { BLUE, GREEN, RED } from 'govuk-colours'

export const STATUS = {
  DRAFT: 'draft',
  COMPLETE: 'complete',
  UPCOMING: 'upcoming',
  INCOMPLETE: 'incomplete',
  CANCELLED: 'cancelled',
}

export const BADGES = {
  INTERACTION: {
    COMPLETE: {
      text: 'Interaction',
      borderColour: GREEN,
    },
    UPCOMING: {
      text: 'Upcoming interaction',
      borderColour: BLUE,
    },
    INCOMPLETE: {
      text: 'Incomplete interaction',
      borderColour: BLUE,
    },
    CANCELLED: {
      text: 'Cancelled interaction',
      borderColour: RED,
    },
    SERVICE_DELIVERY: {
      text: 'Service delivery',
      borderColour: GREEN,
    },
  },
  REFERRAL: {
    COMPLETE: {
      text: 'Completed referral',
      borderColour: GREEN,
    },
    OUTSTANDING: {
      text: 'Outstanding referral',
      borderColour: BLUE,
    },
  },
}

export const SOURCE_TYPES = {
  external: 'externalDataSource',
}

export const ACTIVITY_TYPE = {
  CompaniesHouseAccount: ['dit:Accounts'],
  CompaniesHouseCompany: ['dit:Company'],
  HmrcExporter: ['dit:Export'],
  Interaction: ['dit:Interaction', 'dit:ServiceDelivery'],
  InvestmentProject: ['dit:InvestmentProject'],
  Omis: ['dit:OMISOrder'],
  Referral: ['dit:CompanyReferral'],
  MaxEmail: ['Document', 'dit:maxemail:Email'],
  DirectoryFormsApi: ['dit:directoryFormsApi:Submission'],
}

export const ACTIVITY_TYPE_FILTERS = {
  allActivity: {
    label: 'All Data Hub & external activity',
    value: 'allActivity',
  },
  myActivity: {
    label: 'My activity',
    value: 'myActivity',
  },
  externalActivity: {
    label: 'All external activity',
    value: 'externalActivity',
  },
  dataHubActivity: {
    label: 'All Data Hub activity',
    value: 'dataHubActivity',
  },
}

export default {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_FILTERS,
  SOURCE_TYPES,
  STATUS,
  BADGES,
}
