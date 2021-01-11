import axios from 'axios'

const API_PROXY_BASE_URL = process.env.GATSBY_API_PROXY_BASE_URL

function handleError(error) {
  const message = error.response.data.detail
  return Promise.reject({
    message,
    ...error,
  })
}

function getProjects({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post(`${API_PROXY_BASE_URL}/api-proxy/v3/search/investment_project`, {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => data, handleError)
}

/**
 * Get metadata options as a list of values and labels
 */
function getMetadataOptions(url) {
  return axios
    .get(`${API_PROXY_BASE_URL}${url}`)
    .then(({ data }) =>
      data.map(({ id, name }) => ({ value: id, label: name }))
    )
}

/**
 * Get the top-level sector options as a list of values and labels
 *
 * Specifying a searchString uses the autocomplete feature to only show
 * matching results.
 */
function getSectorOptions(url, searchString) {
  return axios
    .get(`${API_PROXY_BASE_URL}${url}`, {
      params: searchString ? { autocomplete: searchString } : {},
    })
    .then(({ data }) =>
      data
        .filter(({ level }) => level === 0)
        .map(({ id, name }) => ({ value: id, label: name }))
    )
}

function getAdviserNames(adviser) {
  if (!adviser) {
    return []
  }

  const advisers = Array.isArray(adviser) ? adviser : [adviser]

  return axios
    .all(
      advisers.map((adviser) =>
        axios.get(`${API_PROXY_BASE_URL}/api-proxy/adviser/${adviser}/`)
      )
    )
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          advisers: data,
        }))
      )
    )
}

/**
 * Get the options for each of the given metadata urls.
 *
 * Waits until all urls have been fetched before generating a result.
 *
 * @param {object} metadataUrls - a lookup of category names to the api url
 *
 * @returns {promise} - the promise containing a list of options for each category
 */
function getMetadata(metadataUrls) {
  const optionCategories = Object.keys(metadataUrls)
  return Promise.all(
    optionCategories.map((name) =>
      name == 'sectorOptions'
        ? getSectorOptions(metadataUrls[name])
        : getMetadataOptions(metadataUrls[name])
    ),
    handleError
  ).then((results) =>
    Object.fromEntries(
      results.map((options, index) => [optionCategories[index], options])
    )
  )
}

export { getProjects, getAdviserNames, getMetadata }
