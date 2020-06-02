import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const postcodeToRegion = (postcode) =>
  axios
    .get(`/api/postcode-to-region-lookup/${postcode}`)
    .catch(handleError)
    .then(({ data }) => data)
