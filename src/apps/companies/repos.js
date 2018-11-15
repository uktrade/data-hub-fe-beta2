/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

// Get a company and then pad out the interactions with related data
function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v3/company/${id}`)
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v3/ch-company/${id}`)
}

function saveCompany (token, company) {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedCompany = Object.assign({}, company)
      delete parsedCompany.companies_house_data
      delete parsedCompany.contacts
      delete parsedCompany.interactions

      let method
      let url

      if (parsedCompany.id && parsedCompany.id.length > 0) {
        method = 'PATCH'
        url = `${config.apiRoot}/v3/company/${parsedCompany.id}`
      } else {
        delete parsedCompany.id
        method = 'POST'
        url = `${config.apiRoot}/v3/company`
      }

      const data = await authorisedRequest(token, { url, method, body: parsedCompany })
      resolve(data)
    } catch (error) {
      if (typeof error.error === 'string') {
        reject({
          statusCode: error.response.statusCode,
          errors: { detail: error.response.statusMessage },
        })
      } else {
        reject({
          statusCode: error.response.statusCode,
          errors: error.error,
        })
      }
    }
  })
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/company/${companyId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v3/company/${companyId}/unarchive`,
  })
}

function updateCompany (token, companyId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}`,
    method: 'PATCH',
    body,
  })
}

function getCompanyAuditLog (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/audit`,
    qs: { limit, offset },
  })
}

function getCompanyTimeline (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/timeline`,
    qs: { limit, offset },
  })
}

function getCompanySubsidiaries (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_headquarters_id: companyId,
    },
  })
}

function getCoreTeam (token, companyId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/core-team`,
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  getCHCompany,
  archiveCompany,
  unarchiveCompany,
  updateCompany,
  getCompanyAuditLog,
  getCompanyTimeline,
  getCompanySubsidiaries,
  getCoreTeam,
}
