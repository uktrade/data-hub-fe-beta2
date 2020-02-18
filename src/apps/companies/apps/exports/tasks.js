import axios from 'axios'
import { DateUtils } from 'data-hub-components'

const COUNTRY_HISTORY_TYPE_TEXT = {
  insert: 'added to',
  delete: 'removed from',
}
const COUNTRY_TYPE_TEXT = {
  future_interest: 'future countries of interest',
  currently_exporting: 'currently exporting',
  not_interested: 'countries of no interest',
}

const getCountryText = (country, historyType, status) => {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[status]

  return [country, historyTypeText, typeText].join(' ')
}

const createCountry = (item) => ({
  headingText: getCountryText(
    item.country.name,
    item.history_type,
    item.status
  ),
  metadata: [
    { label: 'By', value: item.history_user.name },
    { label: 'Date', value: DateUtils.formatWithTime(item.history_date) },
  ],
})

const transformFullExportHistory = ({ count, results }) => ({
  count,
  results: results.map(createCountry),
})

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const fetchExportsHistory = ({ companyId, activePage }) =>
  axios
    .post('/api-proxy/v4/search/export-country-history', {
      company: companyId,
      limit: 10,
      offset: Number(activePage) * 10 - 10,
    })
    .catch(handleError)
    .then(({ data }) => transformFullExportHistory(data))
