const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')
const { buildQueryString } = require('../../lib/url-helpers')

const entities = [
  {
    entity: 'company',
    path: 'companies',
    text: 'Companies',
    count: 0,
  },
  {
    entity: 'contact',
    path: 'contacts',
    text: 'Contacts',
    count: 0,
  },
]

function search ({ token, searchTerm, searchEntity, limit = 10, page = 1 }) {
  const params = {
    term: searchTerm,
    entity: searchEntity,
    limit,
    offset: (page * limit) - limit,
  }

  const options = {
    url: `${config.apiRoot}/v3/search${buildQueryString(params)}`,
    method: 'GET',
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

// TODO the search endpoints need aligning see Jira DH-293 for details
function searchCompanies ({ token, searchTerm, isUkBased, page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = {
    original_query: searchTerm,
    uk_based: isUkBased,
  }
  const options = {
    url: `${config.apiRoot}/v3/search/company${buildQueryString(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

function searchForeignCompanies (options) {
  const optionsUkBasedFalse = Object.assign({}, options, { isUkBased: false })

  return searchCompanies(optionsUkBasedFalse)
}

function searchLimitedCompanies (options) {
  const optionsUkBasedTrue = Object.assign({}, options, { isUkBased: true })

  return searchCompanies(optionsUkBasedTrue)
    .then((result) => {
      const limitedCompanies = result.results.filter((company) => {
        return company.company_number ||
          (company.business_type && company.business_type.name.toLowerCase().includes('limited company'))
      })

      return {
        page: result.page,
        results: limitedCompanies,
        count: result.count,
      }
    })
}

function buildSearchEntityResultsData (apiResponseEntities) {
  return entities.map((defaultEntity) => {
    return Object.assign(
      {},
      defaultEntity,
      apiResponseEntities.find((apiResponseEntity) => {
        return apiResponseEntity.entity === defaultEntity.entity
      })
    )
  })
}

module.exports = {
  entities,
  search,
  searchCompanies,
  searchLimitedCompanies,
  searchForeignCompanies,
  buildSearchEntityResultsData,
}
