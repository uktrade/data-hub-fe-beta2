const axios = require('axios')

export function getInteractions() {
  return axios.get(`/api-proxy/v3/interaction`).then(({ data }) => data.results)
}
