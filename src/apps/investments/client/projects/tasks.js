import axios from 'axios'

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
    .post('/api-proxy/v3/search/investment_project', {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => data, handleError)
}

function getAdviserNames(adviser) {
  if (!adviser) {
    return []
  }

  const advisers = Array.isArray(adviser) ? adviser : [adviser]

  return axios
    .all(advisers.map((adviser) => axios.get(`/api-proxy/adviser/${adviser}/`)))
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          advisers: data,
        }))
      )
    )
}

export { getProjects, getAdviserNames }
