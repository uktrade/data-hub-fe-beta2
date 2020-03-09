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

function getPath(path, tokens, params) {
  if (path === '/') {
    return ''
  }

  tokens.forEach((token, index) => {
    const value = params[index]

    if (typeof value !== 'undefined') {
      path = path.replace(token, value)
    } else {
      path = path.replace('/' + token, '')
    }
  })

  return path
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
    return mountPoint + getPath(tokenPath, tokens, params)
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

function createInteractionsSubApp(...mountPoints) {
  if (mountPoints.length === 0) {
    mountPoints.push(null)
  }
  return {
    create: url(...mountPoints, '/interactions/:interactionId?/create'),
    createType: url(...mountPoints, '/interactions/create/:theme/:kind'),
  }
}

module.exports = {
  external: {
    greatProfile: (id) =>
      `https://www.great.gov.uk/international/trade/suppliers/${id}`,
    companiesHouse: (companyNumber) =>
      `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
    findExporters: () => 'https://find-exporters.datahub.trade.gov.uk/',
    exportWins: () => 'https://www.exportwins.service.trade.gov.uk/',
  },
  dashboard: url('/'),
  companies: {
    index: url('/companies'),
    create: url('/companies', '/create'),
    export: url('/companies', '/export'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    audit: url('/companies', '/:companyId/audit'),
    lists: url('/companies', '/:companyId/lists'),
    orders: url('/companies', '/:companyId/orders'),
    details: url('/companies', '/:companyId/details'),
    archive: url('/companies', '/:companyId/archive'),
    contacts: url('companies', '/:companyId/contacts'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    documents: url('/companies', '/:companyId/documents'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    interactions: createInteractionsSubApp('/companies', '/:companyId'),
    manageCompanyList: url('/companies', '/:companyId/manage-company-list'),
    sendReferral: url('/companies', '/:companyId/send-referral'),
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
    audit: url('/contacts', '/:contactId/audit'),
    contact: url('/contacts', '/:contactId'),
    create: url('/contacts/create?company=', ':companyId'),
    contactInteractions: url('/contacts', '/:contactId/interactions'),
    details: url('/contacts', '/:contactId/details'),
    documents: url('/contacts', '/:contactId/documents'),
    edit: url('/contacts', '/:contactId/edit'),
    interactions: createInteractionsSubApp('/contacts', '/:contactId'),
  },
  events: {
    index: url('/events'),
    create: url('/events/create'),
    details: url('/events', '/:eventId/details'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    index: url('/interactions'),
    detail: url('/interactions', '/:interactionId'),
    subapp: createInteractionsSubApp(),
  },
  investments: {
    index: url('/investments'),
    projects: {
      index: url('/investments', '/projects'),
      details: url('/investments', '/projects/:projectId/details'),
      documents: url('/investments', '/projects/:projectId/documents'),
      propositions: url('/investments', '/projects/:projectId/propositions'),
      team: url('/investments', '/projects/:projectId/team'),
      interactions: createInteractionsSubApp(
        '/investments',
        '/projects/:projectId'
      ),
      interactionCollection: url(
        '/investments',
        '/projects/:projectId/interactions'
      ),
      project: url('/investments', '/projects/:projectId'),
      status: url('/investments', '/projects/:projectId/status'),
    },
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
  },
  omis: {
    index: url('/omis'),
    create: url('/omis/create?company=', ':companyId'),
  },
  support: url('/support'),
  referrals: {
    index: url('/referrals'),
    send: url('/referrals', '/:companyId/send'),
    send2: url('/referrals', '/:companyId/send2'),
    details: url('/referrals', '/:referralId'),
    help: url('/referrals', '/:referralId/help'),
  },
}
