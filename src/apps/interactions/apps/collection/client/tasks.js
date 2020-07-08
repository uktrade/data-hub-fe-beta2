const axios = require('axios')

export function updateInteractions({ filters, page }) {
  const body = {
    sortby: 'date:desc',
    offset: page ? (page - 1) * 10 : undefined,
    limit: 10,
    custom: true,
    kind: filters?.kind?.map((kind) => kind),
    dit_participants__adviser: filters?.dit_participants?.map(
      ({ value }) => value
    ),
  }
  return axios
    .post(`/api-proxy/v3/search/interaction`, body)
    .then(({ data }) => data)
}
