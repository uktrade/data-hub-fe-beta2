import axios from 'axios'
import { metadata } from '../../../lib/urls'

export default function useAdministrativeAreaLookup() {
  return async function findAreaByCountryId(countryId = undefined) {
    const { data } = await axios(metadata.administrativeArea())
    return countryId ? filterAreaDataByCountry(data, countryId) : data
  }
}

export function filterAreaDataByCountry(data, countryId) {
  const activeAreas = data.filter((area) => area.disabled_on === null)
  return activeAreas.filter((area) => area.country.id === countryId)
}
