const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

function getContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/contact/${contactId}`)
}

function saveContact (token, contact) {
  let options = {
    body: contact,
  }

  if (contact.id && contact.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/v3/contact/${contact.id}`
    options.method = 'PATCH'
  } else {
    options.url = `${config.apiRoot}/v3/contact`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

function archiveContact (token, contactId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/contact/${contactId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveContact (token, contactId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v3/contact/${contactId}/unarchive`,
  })
}

async function getContactsForCompany (token, companyId) {
  const response = await authorisedRequest(token, {
    url: `${config.apiRoot}/v3/contact`,
    qs: {
      company_id: companyId,
      limit: 500,
    },
  })
  return response.results
}

function getContactAuditLog (token, contactId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/contact/${contactId}/audit?limit=${limit}&offset=${offset}`)
}

module.exports = {
  getContact,
  saveContact,
  archiveContact,
  unarchiveContact,
  getContactsForCompany,
  getContactAuditLog,
}
