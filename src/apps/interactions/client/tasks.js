import axios from 'axios'

import { transformResponseToCollection } from './transformers'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getInteractions = ({ limit = 10, page = 1 }) =>
  axios
    .post('/api-proxy/v3/search/interaction', {
      limit,
      offset: limit * (page - 1),
      sortby: 'date:desc',
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)
