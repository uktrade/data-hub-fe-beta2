import {
  buildDatesFilter,
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'
import { LABELS, COMPANY_STATUS_OPTIONS } from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedLeadItaOrGlobalAccountManagers
) => ({
  headquarterTypes: {
    queryParam: 'headquarter_type',
    options: buildOptionsFilter({
      options: metadata.headquarterTypeOptions,
      value: queryParams.headquarter_type,
      categoryLabel: LABELS.headquarterType,
    }),
  },
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.companyName,
    }),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: LABELS.sector,
    }),
  },
  countries: {
    queryParam: 'country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.country,
      categoryLabel: LABELS.country,
    }),
  },
  ukPostcode: {
    queryParam: 'uk_postcode',
    options: buildInputFieldFilter({
      value: queryParams.uk_postcode,
      categoryLabel: LABELS.ukPostcode,
    }),
  },
  ukRegions: {
    queryParam: 'uk_region',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.uk_region,
      categoryLabel: LABELS.ukRegion,
    }),
  },
  usStates: {
    queryParam: 'us_state',
    options: buildOptionsFilter({
      options: metadata.usStateOptions,
      value: queryParams.us_state,
      categoryLabel: LABELS.usState,
    }),
  },
  canadianProvinces: {
    queryParam: 'canadian_province',
    options: buildOptionsFilter({
      options: metadata.canadianProvinceOptions,
      value: queryParams.canadian_province,
      categoryLabel: LABELS.canadianProvince,
    }),
  },
  companyStatuses: {
    queryParam: 'archived',
    options: buildOptionsFilter({
      options: COMPANY_STATUS_OPTIONS,
      value: queryParams.archived,
      categoryLabel: LABELS.companyStatus,
    }),
  },
  exportToCountries: {
    queryParam: 'export_to_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.export_to_countries,
      categoryLabel: LABELS.currentlyExportingTo,
    }),
  },
  futureCountriesOfInterest: {
    queryParam: 'future_interest_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.future_interest_countries,
      categoryLabel: LABELS.futureCountriesOfInterest,
    }),
  },
  lastInteractionDateAfter: {
    queryParam: 'latest_interaction_date_after',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_after,
      categoryLabel: LABELS.lastInteractionAfter,
    }),
  },
  lastInteractionDateBefore: {
    queryParam: 'latest_interaction_date_before',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_before,
      categoryLabel: LABELS.lastInteractionBefore,
    }),
  },
  leadItaOrGlobalAccountManagers: {
    queryParam: 'one_list_group_global_account_manager',
    options: selectedLeadItaOrGlobalAccountManagers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.leadItaOrGlobalAccountManager,
    })),
  },
})
