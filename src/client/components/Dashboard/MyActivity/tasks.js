import axios from 'axios'
import format from 'date-fns/format'

export async function getMyActivity({ startDate }) {
  const todaysDate = format(new Date(), 'YYYY-MM-DD')

  const {
    data: { id },
  } = await axios.get('api-proxy/whoami/')
  const referrals = await axios.get('api-proxy/v4/company-referral')
  const interactions = await axios.post('/api-proxy/v3/search/interaction', {
    dit_participants__adviser: [id],
    date_before: todaysDate,
    date_after: startDate,
  })

  return {
    referralsSent: referrals.data.results.filter(
      (referral) => referral.created_by.id === id
    ),
    interactions: interactions.data.results,
  }
}
