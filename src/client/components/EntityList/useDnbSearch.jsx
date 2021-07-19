/* eslint-disable camelcase */

import axios from 'axios'
import { compact, isEmpty } from 'lodash'
import { getCompanyAddress } from '../../utils/addresses'

function getTradingNames(dnb_company) {
  return isEmpty(dnb_company.trading_names)
    ? null
    : {
        label: 'Trading name(s)',
        value: dnb_company.trading_names.join(', '),
      }
}

function getAddress(dnb_company, features) {
  return {
    label: 'Location at',
    value: getCompanyAddress(dnb_company, features),
  }
}

function useDnbSearch(apiEndpoint, features) {
  function transformCompanyRecord(record) {
    const { dnb_company } = record

    return {
      id: dnb_company.duns_number,
      heading: dnb_company.primary_name,
      meta: compact([
        getTradingNames(dnb_company),
        getAddress(dnb_company, features),
      ]),
      data: record,
    }
  }

  async function findCompany(filters) {
    const { data } = await axios.post(apiEndpoint, filters)

    return data.results.map(transformCompanyRecord)
  }

  return {
    findCompany,
    transformCompanyRecord,
  }
}

export default useDnbSearch
