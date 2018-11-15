const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')
const { getDitCompany } = require('../companies/repos')

function getCompanyInvestmentProjects (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/investment?investor_company_id=${companyId}&limit=${limit}&offset=${offset}`)
}

function getInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}`)
}

function updateInvestment (token, investmentId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}`,
    method: 'PATCH',
    body,
  })
}

function getEquityCompanyDetails (token, equityCompanyId) {
  const promises = [
    getDitCompany(token, equityCompanyId),
    getCompanyInvestmentProjects(token, equityCompanyId),
  ]

  return Promise.all(promises)
    .then(([equityCompany, equityCompanyInvestments]) => {
      return {
        equityCompany,
        equityCompanyInvestments,
      }
    })
}

function createInvestmentProject (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment`,
    method: 'POST',
    body,
  })
}

function getInvestmentProjectAuditLog (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/audit`)
    .then((data) => {
      return data.results
    })
}

function archiveInvestmentProject (token, investmentId, reason) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/archive`,
    method: 'POST',
    body: {
      reason,
    },
  })
}

function unarchiveInvestmentProject (token, investmentId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/unarchive`,
    method: 'POST',
  })
}

async function updateInvestmentTeamMembers (token, investmentId, investmentTeamMembers) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/team-member`,
    method: 'PUT',
    body: investmentTeamMembers,
  })
}

module.exports = {
  getCompanyInvestmentProjects,
  getInvestment,
  updateInvestment,
  getEquityCompanyDetails,
  createInvestmentProject,
  getInvestmentProjectAuditLog,
  archiveInvestmentProject,
  unarchiveInvestmentProject,
  updateInvestmentTeamMembers,
}
