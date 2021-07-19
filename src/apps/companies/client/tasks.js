import axios from 'axios'

import urls from '../../../lib/urls'
import {
  getHeadquarterTypeOptions,
  getMetadataOptions,
} from '../../../client/metadata'

import { transformResponseToCompanyCollection } from './transformers'

const usa = '81756b9a-5d95-e211-a939-e4115bead28a'
const canada = '5daf72a6-5d95-e211-a939-e4115bead28a'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getCompanies = ({
  limit = 10,
  page,
  headquarter_type,
  name,
  sector_descends,
  country,
  uk_postcode,
  uk_region,
  us_state = [],
  canadian_province = [],
  archived,
  export_to_countries,
  future_interest_countries,
  latest_interaction_date_before,
  latest_interaction_date_after,
  one_list_group_global_account_manager,
  sortby = 'modified_on:desc',
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  return axios
    .post('/api-proxy/v4/search/company', {
      limit,
      offset: limit * (page - 1) || 0,
      headquarter_type,
      name,
      sector_descends,
      country,
      uk_postcode,
      uk_region,
      administrative_area: administrativeAreas.length
        ? administrativeAreas
        : undefined,
      archived,
      export_to_countries,
      future_interest_countries,
      latest_interaction_date_before,
      latest_interaction_date_after,
      one_list_group_global_account_manager,
      sortby,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data))
    .catch(handleError)
}

/**
 * Get the options for each of the metadata urls.
 *
 * Waits until all urls have been fetched before generating a result.
 *
 * @returns {promise} - the promise containing a list of options for each category
 */
const getCompaniesMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getHeadquarterTypeOptions(urls.metadata.headquarterType()),
    getMetadataOptions(urls.metadata.ukRegion()),
    getMetadataOptions(urls.metadata.administrativeArea(), {
      params: { country: usa },
    }),
    getMetadataOptions(urls.metadata.administrativeArea(), {
      params: { country: canada },
    }),
    getMetadataOptions(urls.metadata.country()),
  ])
    .then(
      ([
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        usStateOptions,
        canadianProvinceOptions,
        countryOptions,
      ]) => ({
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        usStateOptions,
        canadianProvinceOptions,
        countryOptions,
      })
    )
    .catch(handleError)

export { getCompanies, getCompaniesMetadata }
