import axios from 'axios'

import urls from '../../../lib/urls'

import { transformResponseToCollection } from './transformers'

import { getMetadataOptions } from '../../../client/metadata'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const sortServiceOptions = (options) =>
  options.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))

const getInteractionsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.service()),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
  ])
    .then(([serviceOptions, sectorOptions]) => ({
      serviceOptions: sortServiceOptions(serviceOptions),
      sectorOptions,
    }))
    .catch(handleError)

const getInteractions = ({
  limit = 10,
  page = 1,
  kind,
  adviser,
  service,
  date_before,
  date_after,
  sortby = 'date:desc',
  sector_descends,
  was_policy_feedback_provided,
}) =>
  axios
    .post('/api-proxy/v3/search/interaction', {
      limit,
      kind,
      dit_participants__adviser: adviser,
      offset: limit * (page - 1),
      sortby,
      date_before,
      date_after,
      service,
      sector_descends,
      was_policy_feedback_provided,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

export { getInteractions, getInteractionsMetadata }
