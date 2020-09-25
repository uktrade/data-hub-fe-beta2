const ES_KEYS = {
  attributedTo: 'object.attributedTo.id',
  companiesHouseAccount: 'dit:Accounts',
  companiesHouseCompany: 'dit:Company',
  companyReferral: 'dit:CompanyReferral',
  directoryFormsApi: 'dit:directoryFormsApi:Submission',
  hmrcExporter: 'dit:Export',
  interaction: 'dit:Interaction',
  investmentProject: 'dit:InvestmentProject',
  maxEmail: 'dit:maxemail:Email',
  omis: 'dit:OMISOrder',
  serviceDelivery: 'dit:ServiceDelivery',
  type: 'object.type',
}

const ES_KEYS_GROUPED = {
  allActivity: [
    ES_KEYS.companiesHouseAccount,
    ES_KEYS.companiesHouseCompany,
    ES_KEYS.hmrcExporter,
    ES_KEYS.interaction, // Interaction
    ES_KEYS.serviceDelivery, // Interaction
    ES_KEYS.investmentProject,
    ES_KEYS.omis,
    ES_KEYS.companyReferral,
  ],

  externalActivity: [
    ES_KEYS.companiesHouseAccount,
    ES_KEYS.companiesHouseCompany,
    ES_KEYS.hmrcExporter,
  ],

  dataHubActivity: [
    ES_KEYS.companyReferral,
    ES_KEYS.directoryFormsApi,
    ES_KEYS.interaction, // Interaction
    ES_KEYS.investmentProject,
    ES_KEYS.maxEmail,
    ES_KEYS.omis,
    ES_KEYS.serviceDelivery, // Interaction
  ],
}

const FILTER_KEYS = {
  allActivity: 'allActivity',
  myActivity: 'myActivity',
  externalActivity: 'externalActivity',
  dataHubActivity: 'dataHubActivity',
  ultimateHQSubsidiaries: 'ultimateHQSubsidiaries',
}

const FILTER_ITEMS = {
  allActivity: {
    label: 'All Data Hub & external activity',
    value: FILTER_KEYS.allActivity,
  },

  externalActivity: {
    label: 'All external activity',
    value: FILTER_KEYS.externalActivity,
  },

  myActivity: {
    label: 'My activity',
    value: FILTER_KEYS.myActivity,
  },

  dataHubActivity: {
    label: 'All Data Hub activity',
    value: FILTER_KEYS.dataHubActivity,
  },
}

module.exports = {
  ES_KEYS,
  FILTER_KEYS,
  FILTER_ITEMS,
  ES_KEYS_GROUPED,
}
