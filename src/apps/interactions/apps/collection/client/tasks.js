const axios = require('axios')

export function getInteractions({ values }, payload) {
  const body = {
    sortby: 'date:desc',
    custom: true,
    dit_participants__adviser: values?.dit_participants?.map(
      ({ value }) => value
    ),
  }

  return axios
    .post(`/api-proxy/v3/search/interaction`, body)
    .then(({ data }) => {
      return data
    })
}
