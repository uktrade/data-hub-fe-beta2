import axios from 'axios'

import { API_ERROR, API_WARN, SAVED } from './state'
import urls from '../../../../../../lib/urls'
import getExportCountries from '../../../../../../lib/get-export-countries'

function transformFieldValues(fields) {
  const countries = {}
  const regions = {}

  for (const [name, values] of Object.entries(fields)) {
    regions[name] = values
      ?.filter(({ region }) => !!region)
      .map(({ value }) => value)

    countries[name] = values
      ?.filter(({ country }) => !!country)
      .map(({ value }) => value)
  }

  return { countries, regions }
}

export function saveExportCountries({ values, companyId }) {
  const { countries, regions } = transformFieldValues(values)
  return axios
    .patch(`/api-proxy/v4/company/${companyId}/export-detail`, {
      export_countries: getExportCountries(countries) || [],
      export_regions: getExportCountries(regions, 'region') || [],
    })
    .catch((e) => {
      const is400 = e?.response?.status === 400
      const nonFieldMessages = is400 && e.response.data?.non_field_errors
      if (nonFieldMessages?.length) {
        return Promise.reject({
          message: { [API_ERROR]: nonFieldMessages.join(', ') },
        })
      } else {
        return Promise.reject({ message: { [API_WARN]: e.message } })
      }
    })
    .then(() => ({ [SAVED]: urls.companies.exports.index(companyId) }))
}
