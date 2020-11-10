import axios from 'axios'
import format from 'date-fns/format'

export async function getMyActivity({ startDate }) {
  const todaysDate = format(new Date(), 'YYYY-MM-DD')
  const interactions = await axios.post('/api-proxy/v3/search/interaction', {
    dit_participants__adviser: ['e48e24a1-09f4-46e6-89ac-612ce89a231f'],
    date_before: todaysDate,
    date_after: startDate,
  })
  return {
    interactions: interactions.data.results,
  }
}
