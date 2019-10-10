const config = require('../../config')

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
  },
  companies: {
    detail: (id) => `/companies/${id}`,
    exports: (id) => `/companies/${id}/exports`,
  },
}
