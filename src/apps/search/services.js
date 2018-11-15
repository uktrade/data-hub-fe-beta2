const queryString = require('qs')
const { assign } = require('lodash')

const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

function search ({ token, searchTerm = '', searchEntity, requestBody, isAggregation = true, limit = 10, page = 1 }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: isAggregation ? searchUrl : `${searchUrl}/${searchEntity}`,
    method: isAggregation ? 'GET' : 'POST',
  }
  requestBody = assign({}, requestBody, {
    term: searchTerm,
    limit,
    offset: (page * limit) - limit,
  })

  if (isAggregation) {
    options.qs = assign(requestBody, {
      entity: searchEntity,
    })
  } else {
    options.body = requestBody
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

// TODO the search endpoints need aligning see Jira DH-293 for details
function searchCompanies ({ token, searchTerm, isUkBased, page = 1, limit = 10, requestBody = {} }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = assign({}, requestBody, {
    original_query: searchTerm,
    uk_based: isUkBased,
    isAggregation: false,
  })

  const options = {
    url: `${config.apiRoot}/v3/search/company?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

function searchInvestments ({ token, searchTerm, page = 1, limit = 10, filters = {} }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = assign({}, filters, {
    original_query: searchTerm,
    searchEntity: 'investment_project',
  })

  const options = {
    url: `${config.apiRoot}/v3/search/investment_project?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then((result) => {
      result.page = page
      return result
    })
}

function searchForeignCompanies (options) {
  const optionsUkBasedFalse = assign({}, options, { isUkBased: false })

  return searchCompanies(optionsUkBasedFalse)
}

function searchLimitedCompanies ({ token, searchTerm, page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = {
    original_query: searchTerm,
  }

  const options = {
    url: `${config.apiRoot}/v3/search/companieshousecompany?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then((result) => {
      result.page = page
      return result
    })
}

module.exports = {
  search,
  searchCompanies,
  searchLimitedCompanies,
  searchForeignCompanies,
  searchInvestments,
}
