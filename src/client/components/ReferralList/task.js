import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const convertAdviser = ({ name, contact_email, dit_team }) => ({
  name,
  email: contact_email,
  team: dit_team?.name,
})

export default () =>
  axios
    .get('/api-proxy/v4/company-referral')
    .catch(handleError)
    .then(({ data: { results } }) =>
      results.map(
        ({
          id,
          subject,
          company,
          status,
          created_by,
          recipient,
          created_on,
        }) => ({
          id,
          status,
          subject,
          companyName: company.name,
          date: created_on,
          sender: convertAdviser(created_by),
          recipient: convertAdviser(recipient),
        })
      )
    )
