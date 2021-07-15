import axios from 'axios'
import urls from '../lib/urls'

export const getTeamNames = (team) => {
  if (!team) {
    return []
  }

  const teams = Array.isArray(team) ? team : [team]

  return axios
    .all(
      teams.map((teamId) => axios.get(`${urls.metadata.team()}?id=${teamId}`))
    )
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          teams: data[0],
        }))
      )
    )
}
