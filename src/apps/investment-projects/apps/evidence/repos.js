const config = require('../../../../../config/index')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function getEvidenceForInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-document`)
}

function fetchDownloadLink (token, investmentId, evidenceId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-document/${evidenceId}/download`)
}

function requestDeleteEvidence (token, investmentId, evidenceId) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${investmentId}/evidence-document/${evidenceId}`,
    method: 'DELETE',
  }

  return authorisedRequest(token, options)
}

module.exports = {
  fetchDownloadLink,
  getEvidenceForInvestment,
  requestDeleteEvidence,
}
