const config = require('../../config')

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
    path = path.replace(token, params[index])
  })
  return path
}

function url (mountPoint, path) {
  const tokens = getTokens(path)

  function getUrl (...params) {
    return (mountPoint + getPath(path, tokens, params))
  }

  getUrl.route = path

  return getUrl
}

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
  },
  companies: {
    collection: url('/companies', '/'),
    detail: url('/companies', '/:companyId'),
    exports: url('/companies', '/:companyId/exports'),
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
      },
    },
  },
}
