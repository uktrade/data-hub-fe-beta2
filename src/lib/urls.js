const config = require('../config')

function getTokens (path) {
  const tokens = []
  const parts = path.split('/')

  parts.forEach((part) => {
    if (part.startsWith(':')) {
      tokens.push(part)
    }
  })

  return tokens
}

function getPath (path, tokens, params) {
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

function url (mountPoint, subMountPoint, path) {
  let tokenPath

  if (path) {
    tokenPath = (subMountPoint + path)
  } else {
    tokenPath = (subMountPoint || '/')
    path = tokenPath
  }

  const tokens = getTokens(tokenPath)

  function getUrl (...params) {
    return (mountPoint + getPath(tokenPath, tokens, params))
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

function createInteractionsSubApp (...mountPoints) {
  if (mountPoints.length === 0) {
    mountPoints.push(null)
  }

  return {
    create: url(...mountPoints, '/interactions/:interactionId?/create'),
  }
}

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
  },
  dashboard: url('/'),
  companies: {
    index: url('/companies'),
    detail: url('/companies', '/:companyId'),
    activity: {
      index: url('/companies', '/:companyId/activity'),
      data: url('/companies', '/:companyId/activity/data'),
    },
    businessDetails: url('/companies', '/:companyId/business-details'),
    dnbSubsidiaries: {
      index: url('/companies', '/:companyId/dnb-subsidiaries'),
      data: url('/companies', '/:companyId/dnb-subsidiaries/data'),
    },
    exports: url('/companies', '/:companyId/exports'),
    audit: url('/companies', '/:companyId/audit'),
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
      },
    },
    advisers: {
      index: url('/companies', '/:companyId/advisers'),
      confirm: url('/companies', '/:companyId/advisers/add'),
      replace: url('/companies', '/:companyId/advisers/replace'),
    },
    subsidiaries: url('/companies', '/:companyId/subsidiaries'),
    interactions: createInteractionsSubApp('/companies', '/:companyId'),
    orders: url('/companies', '/:companyId/orders'),
  },
  contacts: {
    index: url('/contacts'),
    interactions: createInteractionsSubApp('/contacts', '/:contactId'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    subapp: createInteractionsSubApp(),
  },
  investments: {
    index: url('/investments'),
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
  },
}
