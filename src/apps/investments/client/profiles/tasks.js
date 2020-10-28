import axios from 'axios'

function handleSuccess({ data }) {
  return data
}

function handleError(error) {
  const message = error?.response?.data?.detail || error.message
  return Promise.reject({
    message,
    ...error,
  })
}

export function getLargeCapitalProfiles({ limit = 10, page = 1 }) {
  const offset = limit * (page - 1)
  return axios
    .get('/api-proxy/v4/large-investor-profile', {
      params: {
        limit,
        offset,
        sortby: 'modified_on',
      },
    })
    .then(handleSuccess, handleError)
}
