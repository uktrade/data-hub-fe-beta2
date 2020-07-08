const axios = require('axios')

export function filterInteractions({ values }) {
  const body = {
    sortby: 'date:desc',
    offset: 5,
    limit: 10,
    custom: true,
    kind: values?.kind?.map((kind) => kind),
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

// export function getInteractions({ values }) {
//   const query = {
//     // limit: 5,
//   }

//   return axios
//     .get(`/api-proxy/v3/interaction`, { params: { ...query } })
//     .then(({ data }) => {
//       return data
//     })
// }
