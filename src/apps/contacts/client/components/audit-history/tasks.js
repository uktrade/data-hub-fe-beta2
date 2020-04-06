import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export default (id) =>
  axios
    .get(`/v3/contact/${id}/audit?limit=10&offset=0`)
    .catch(handleError)
    .then((data) => data)
