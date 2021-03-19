const queryString = require('qs')

function getTokens(path) {
  const tokens = []
  const parts = path.split('/')

  parts.forEach((part) => {
    if (part.startsWith(':')) {
      tokens.push(part)
    }
  })

  return tokens
}

function getPath(mountPoint, path, tokens, params) {
  if (path === '/') {
    return mountPoint
  }

  return []
    .concat(params)
    .reduce((acc, param, index) => {
      if (param && param.constructor === Object) {
        return (
          acc + (acc.includes('?') ? '&' : '?') + queryString.stringify(param)
        )
      } else if (tokens[index]) {
        return acc.replace(tokens[index], param)
      }
      return acc
    }, mountPoint + path)
    .replace(/\/:\w+\?\//, '/')
}

function url(mountPoint, subMountPoint, path) {
  let tokenPath

  if (path) {
    tokenPath = subMountPoint + path
  } else {
    tokenPath = subMountPoint || '/'
    path = tokenPath
  }

  const tokens = getTokens(tokenPath)

  function getUrl(...params) {
    return getPath(mountPoint, tokenPath, tokens, params)
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

function createInteractionsSubApp(mountPoint, pathPrefix = '') {
  return {
    index: url(mountPoint, pathPrefix),
    detail: url(mountPoint, pathPrefix + '/:interactionId'),
    create: url(mountPoint, pathPrefix + '/create'),
    createType: url(mountPoint, pathPrefix + '/create/:theme/:kind'),
    edit: url(mountPoint, pathPrefix + '/:interactionId/edit'),
    complete: url(mountPoint, pathPrefix + '/:interactionId/complete'),
  }
}

module.exports = {
  testing: {
    index: url('/testing'),
  },
  external: {
    greatProfile: (id) =>
      `https://www.great.gov.uk/international/trade/suppliers/${id}`,
    companiesHouse: (companyNumber) =>
      `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
    findExporters: () => 'https://find-exporters.datahub.trade.gov.uk/',
    exportWins: () => 'https://www.exportwins.service.trade.gov.uk/',
    digitalWorkspace: {
      teams:
        'https://people.trade.gov.uk/teams/department-for-international-trade',
    },
    policyFeedbackHelp:
      'https://data-services-help.trade.gov.uk/data-hub/how-articles/interactions-and-service-delivery/record-business-intelligence-interaction/',
    helpCentre: {
      pipeline: () =>
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/account-management/my-pipeline/',
    },
  },
  dashboard: url('/'),
  oauth: {
    redirect: url('/oauth'),
    callback: url('/oauth/callback'),
    signout: url('/oauth/sign-out'),
  },
  personalisedDashboard: {
    myInvestmentProjects: url('/myinvestmentprojects'),
  },
  companies: {
    index: url('/companies'),
    create: url('/companies', '/create'),
    export: url('/companies', '/export'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    audit: url('/companies', '/:companyId/audit'),
    lists: {
      index: url('/companies', '/:companyId/lists'),
      addRemove: url('/companies', '/:companyId/lists/add-remove'),
    },
    pipelineAdd: url('/companies', '/:companyId/my-pipeline'),
    orders: url('/companies', '/:companyId/orders'),
    details: url('/companies', '/:companyId/details'),
    archive: url('/companies', '/:companyId/archive'),
    contacts: url('/companies', '/:companyId/contacts'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    documents: url('/companies', '/:companyId/documents'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    editOneList: url('/companies', '/:companyId/edit-one-list'),
    interactions: createInteractionsSubApp(
      '/companies',
      '/:companyId/interactions'
    ),
    manageCompanyList: url('/companies', '/:companyId/manage-company-list'),
    referrals: {
      list: url('/my-referrals'),
      send: url('/companies', '/:companyId/referrals/send'),
      details: url('/companies', '/:companyId/referrals/:referralId'),
      help: url('/companies', '/:companyId/referrals/:referralId/help'),
      interactions: createInteractionsSubApp(
        '/companies',
        '/:companyId/referrals/:referralId/interactions'
      ),
    },
    activity: {
      index: url('/companies', '/:companyId/activity'),
      data: url('/companies', '/:companyId/activity/data'),
    },
    advisers: {
      index: url('/companies', '/:companyId/advisers'),
      assign: url('/companies', '/:companyId/advisers/assign'),
      remove: url('/companies', '/:companyId/advisers/remove'),
    },
    editHistory: {
      index: url('/companies', '/:companyId/edit-history'),
      data: url('/companies', '/:companyId/edit-history/data'),
    },
    dnbHierarchy: {
      index: url('/companies', '/:companyId/dnb-hierarchy'),
      data: url('/companies', '/:companyId/dnb-hierarchy/data'),
    },
    exports: {
      index: url('/companies', '/:companyId/exports'),
      edit: url('/companies', '/:companyId/exports/edit'),
      editCountries: url('/companies', '/:companyId/exports/edit-countries'),
      history: {
        index: url('/companies', '/:companyId/exports/history'),
        country: url('/companies', '/:companyId/exports/history/:countryId'),
      },
    },
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
        link: url('/companies', '/:companyId/hierarchies/ghq/search'),
        remove: url('/companies', '/:companyId/hierarchies/ghq/remove'),
      },
      subsidiaries: {
        search: url(
          '/companies',
          '/:companyId/hierarchies/subsidiaries/search'
        ),
        add: url(
          '/companies',
          '/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add'
        ),
      },
    },
    investments: {
      companyInvestment: url('/companies', '/:companyId/investments'),
      companyInvestmentProjects: url(
        '/companies',
        '/:companyId/investments/projects'
      ),
      largeCapitalProfile: url(
        '/companies',
        '/:companyId/investments/large-capital-profile'
      ),
    },
    match: {
      index: url('/companies', '/:companyId/match'),
      confirmation: url('/companies', '/:companyId/match/:dunsNumber'),
      link: url('/companies', '/:companyId/match/link'),
      merge: url('/companies', '/:companyId/match/merge'),
      cannotFind: url('/companies', '/:companyId/match/cannot-find'),
    },
    subsidiaries: {
      index: url('/companies', '/:companyId/subsidiaries'),
      link: url('/companies', '/:companyId/subsidiaries/link'),
    },
  },
  companyLists: {
    delete: url('/company-lists', '/:listId/delete'),
    rename: url('/company-lists', '/:listId/rename'),
  },
  contacts: {
    index: url('/contacts'),
    export: url('/contacts', '/export'),
    audit: url('/contacts', '/:contactId/audit'),
    contact: url('/contacts', '/:contactId'),
    create: url('/contacts/create?company=', ':companyId'),
    contactInteractions: url('/contacts', '/:contactId/interactions'),
    details: url('/contacts', '/:contactId/details'),
    documents: url('/contacts', '/:contactId/documents'),
    edit: url('/contacts', '/:contactId/edit'),
    interactions: createInteractionsSubApp(
      '/contacts',
      '/:contactId/interactions'
    ),
  },
  events: {
    index: url('/events'),
    create: url('/events/create'),
    details: url('/events', '/:eventId/details'),
    attendees: url('/events', '/:eventId/attendees'),
    find: url('/events', '/:eventId/attendees/find-new'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    ...createInteractionsSubApp('/interactions'),
    activeEvents: url('/activeEvents'),
    activeEventsData: url('/interactions', '/activeEvents'),
    export: url('/interactions', '/export'),
  },
  investments: {
    index: url('/investments'),
    projects: {
      index: url('/investments', '/projects'),
      export: url('/investments', '/projects', '/export'),
      details: url('/investments', '/projects/:investmentId/details'),
      editDetails: url('/investments', '/projects/:investmentId/edit-details'),
      editRequirements: url(
        '/investments',
        '/projects/:investmentId/edit-requirements'
      ),
      documents: url('/investments', '/projects/:investmentId/documents'),
      propositions: url('/investments', '/projects/:investmentId/propositions'),
      proposition: url(
        '/investments',
        '/projects/:investmentId/propositions/:propositionId'
      ),
      team: url('/investments', '/projects/:investmentId/team'),
      interactions: createInteractionsSubApp(
        '/investments/projects',
        '/:investmentId/interactions'
      ),
      project: url('/investments', '/projects/:projectId'),
      status: url('/investments', '/projects/:projectId/status'),
      admin: url('/investments', '/projects/:projectId/admin'),
    },
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
    opportunities: {
      details: url('/investments', '/opportunities/:opportunityId/details'),
    },
    editHistory: {
      index: url('/investments/projects', '/:investmentId/edit-history'),
      data: url('/investments/projects', '/:investmentId/edit-history/data'),
    },
  },
  metadata: {
    likelihoodToLand: url('/api-proxy/v4/metadata', '/likelihood-to-land'),
    investmentInvestorType: url(
      '/api-proxy/v4/metadata',
      '/investment-investor-type'
    ),
    investmentInvolvement: url(
      '/api-proxy/v4/metadata',
      '/investment-involvement'
    ),
    investmentSpecificProgramme: url(
      '/api-proxy/v4/metadata',
      '/investment-specific-programme'
    ),
    investmentProjectStage: url(
      '/api-proxy/v4/metadata',
      '/investment-project-stage'
    ),
    investmentBusinessActivity: url(
      '/api-proxy/v4/metadata',
      '/investment-business-activity'
    ),
    investmentType: url('/api-proxy/v4/metadata', '/investment-type'),
    investmentStrategicDriver: url(
      '/api-proxy/v4/metadata',
      '/investment-strategic-driver'
    ),
    orderServiceType: url('/api-proxy/v4/metadata', '/order-service-type'),
    orderCancellationReason: url(
      '/api-proxy/v4/metadata',
      '/order-cancellation-reason'
    ),
    omisMarket: url('/api-proxy/v4/metadata', '/omis-market'),
    salaryRange: url('/api-proxy/v4/metadata', '/salary-range'),
    fdiValue: url('/api-proxy/v4/metadata', '/fdi-value'),
    fdiType: url('/api-proxy/v4/metadata', '/fdi-type'),
    turnover: url('/api-proxy/v4/metadata', '/turnover'),
    sector: url('/api-proxy/v4/metadata', '/sector'),
    locationType: url('/api-proxy/v4/metadata', '/location-type'),
    eventType: url('/api-proxy/v4/metadata', '/event-type'),
    programme: url('/api-proxy/v4/metadata', '/programme'),
    businessType: url('/api-proxy/v4/metadata', '/business-type'),
    evidenceTag: url('/api-proxy/v4/metadata', '/evidence-tag'),
    employeeRange: url('/api-proxy/v4/metadata', '/employee-range'),
    country: url('/api-proxy/v4/metadata', '/country'),
    ukRegion: url('/api-proxy/v4/metadata', '/uk-region'),
    referralSourceWebsite: url(
      '/api-proxy/v4/metadata',
      '/referral-source-website'
    ),
    referralSourceMarketing: url(
      '/api-proxy/v4/metadata',
      '/referral-source-marketing'
    ),
    referralSourceActivity: url(
      '/api-proxy/v4/metadata',
      '/referral-source-activity'
    ),
    headquarterType: url('/api-proxy/v4/metadata', '/headquarter-type'),
    service: url('/api-proxy/v4/metadata', '/service'),
    communicationChannel: url(
      '/api-proxy/v4/metadata',
      '/communication-channel'
    ),
    team: url('/api-proxy/v4/metadata', '/team'),
    policyArea: url('/api-proxy/v4/metadata', '/policy-area'),
    policyIssueType: url('/api-proxy/v4/metadata', '/policy-issue-type'),
    serviceDeliveryStatus: url(
      '/api-proxy/v4/metadata',
      '/service-delivery-status'
    ),
    capitalInvestmentInvestorType: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/investor-type'
    ),
    capitalInvestmentRequiredChecksConducted: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/required-checks-conducted'
    ),
    capitalInvestmentDealTicketSize: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/deal-ticket-size'
    ),
    capitalInvestmentLargeCapitalInvestment: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/large-capital-investment'
    ),
    capitalInvestmentReturnRate: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/return-rate'
    ),
    capitalInvestmentTimeHorizon: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/time-horizon'
    ),
    capitalInvestmentRestriction: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/restriction'
    ),
    capitalInvestmentConstructionRisk: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/construction-risk'
    ),
    capitalInvestmentEquityPercentage: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/equity-percentage'
    ),
    capitalInvestmentDesiredDealRole: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/desired-deal-role'
    ),
    capitalInvestmentAssetClassInterest: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/asset-class-interest'
    ),
    oneListTier: url('/api-proxy/v4/metadata', '/one-list-tier'),
  },
  omis: {
    index: url('/omis'),
    export: url('/omis', '/export'),
    create: url('/omis/create?company=', ':companyId'),
    order: url('/omis', '/:orderId'),
    paymentReceipt: url('/omis', '/:orderId/payment-receipt'),
    quote: url('/omis', '/:orderId/quote'),
    edit: {
      quote: url('/omis', '/:orderId/edit/quote-details'),
    },
  },
  support: url('/support'),
  pipeline: {
    index: url('/my-pipeline'),
    active: url('/my-pipeline/active'),
    won: url('/my-pipeline/won'),
    edit: url('/my-pipeline', '/:pipelineItemId/edit'),
    archive: url('/my-pipeline', '/:pipelineItemId/archive'),
    unarchive: url('/my-pipeline', '/:pipelineItemId/unarchive'),
    delete: url('/my-pipeline', '/:pipelineItemId/delete'),
  },
}
