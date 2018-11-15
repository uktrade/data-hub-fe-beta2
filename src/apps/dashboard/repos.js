const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

function fetchHomepageData (token) {
  return authorisedRequest(token, `${config.apiRoot}/dashboard/homepage/`)
}

module.exports = {
  fetchHomepageData,
}
