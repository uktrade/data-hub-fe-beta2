const queryString = require('qs')

const { authorisedRequest, authorisedRawRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

const buildOptions = (
  isAggregation,
  searchUrl,
  body,
  entity,
) => {
  if (isAggregation) {
    return {
      url: searchUrl,
      method: 'GET',
      qs: {
        ...body,
        entity,
      },
    }
  }

  return {
    body,
    url: `${searchUrl}${entity ? `/${entity}` : ''}`,
    method: 'POST',
  }
}

function search ({
  token,
  searchTerm: term = '',
  searchEntity,
  requestBody,
  isAggregation = true,
  limit = 10,
  page = 1,
}) {
  const apiVersion = !isAggregation && searchEntity === 'company' ? 'v4' : 'v3'
  const searchUrl = `${config.apiRoot}/${apiVersion}/search`

  const body = {
    ...requestBody,
    limit,
    term,
    offset: (page * limit) - limit,
  }

  const options = buildOptions(
    isAggregation,
    searchUrl,
    body,
    searchEntity,
  )

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

function searchEntity (token, body, route, { apiVersion = 'v3', page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }

  const options = {
    body,
    url: `${config.apiRoot}/${apiVersion}/search/${route}?${queryString.stringify(queryParams)}`,
    method: 'POST',
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

function searchCompanies ({ token, searchTerm, isUkBased, page = 1, limit = 10, requestBody = {} }) {
  return searchEntity(token, {
    ...requestBody,
    original_query: searchTerm,
    uk_based: isUkBased,
    isAggregation: false,
  }, 'company', { apiVersion: 'v4', page, limit })
}

function searchInvestments ({ token, searchTerm, page = 1, limit = 10, filters = {} }) {
  return searchEntity(token, {
    ...filters,
    original_query: searchTerm,
    searchEntity: 'investment_project',
  }, 'investment_project', { page, limit })
}

function searchForeignCompanies ({ token, searchTerm, page = 1, limit = 10 }) {
  return searchCompanies({
    token,
    searchTerm,
    page,
    limit,
    isUkBased: false,
  })
}

function searchLimitedCompanies ({ token, searchTerm, page = 1, limit = 10 }) {
  return searchEntity(token, {
    original_query: searchTerm,
  }, 'companieshousecompany', { apiVersion: 'v4', page, limit })
}

function exportSearch ({ token, searchTerm = '', searchEntity, requestBody }) {
  const apiVersion = searchEntity === 'company' ? 'v4' : 'v3'
  const searchUrl = `${config.apiRoot}/${apiVersion}/search`
  const options = {
    url: `${searchUrl}/${searchEntity}/export`,
    method: 'POST',
    body: {
      ...requestBody,
      term: searchTerm,
    },
  }

  return authorisedRawRequest(token, options)
}

function searchAutocomplete ({ token, searchEntity, searchTerm = '', requestBody = {} }) {
  const searchUrl = `${config.apiRoot}/v4/search/${searchEntity}/autocomplete?term=${searchTerm}`
  const body = {
    ...requestBody,
  }

  const options = buildOptions(
    true,
    searchUrl,
    body,
  )

  return authorisedRequest(token, options)
    .then(result => {
      return result
    })
}

function searchDnbCompanies ({ token, requestBody = {} }) {
  const url = `${config.apiRoot}/v4/dnb/company-search`
  const options = buildOptions(false, url, requestBody)

  return authorisedRequest(token, options)
    .then(result => {
      return result
    })
}

module.exports = {
  search,
  searchCompanies,
  searchLimitedCompanies,
  searchForeignCompanies,
  searchInvestments,
  exportSearch,
  searchAutocomplete,
  searchDnbCompanies,
}
