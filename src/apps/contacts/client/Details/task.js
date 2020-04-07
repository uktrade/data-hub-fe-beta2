import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export default (id) =>
  axios
    .get('/api-proxy/v3/contact/' + id)
    .catch(handleError)
    .then(async ({ data }) => ({
      jobTitle: data.job_title,
      phoneCountryCode: data.telephone_countrycode,
      phoneNumber: data.telephone_number,
      email: data.email,
      acceptsMarketing: data.accepts_dit_email_marketing,
      address:
        data.address_same_as_company &&
        (await axios
          .get('/api-proxy/v4/company/' + data.company.id)
          .then(({ data: { address } }) =>
            Object.values({
              ...address,
              country: address.country.name,
            }).filter(Boolean)
          )),
    }))
