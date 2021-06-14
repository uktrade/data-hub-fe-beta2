import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'
import * as labels from './labels'
import { COMPANY_STATUS_OPTIONS } from './metadata'

export const buildSelectedFilters = (queryParams, metadata) => ({
  selectedCountries: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.country,
    categoryLabel: labels.COUNTRY,
  }),
  selectedHeadquarterTypes: buildOptionsFilter({
    options: metadata.headquarterTypeOptions,
    value: queryParams.headquarter_type,
    categoryLabel: labels.HEADQUARTER_TYPE,
  }),
  selectedName: buildInputFieldFilter({
    value: queryParams.name,
    categoryLabel: labels.COMPANY_NAME,
  }),
  selectedSectors: buildOptionsFilter({
    options: metadata.sectorOptions,
    value: queryParams.sector_descends,
    categoryLabel: labels.SECTOR,
  }),
  selectedUkRegions: buildOptionsFilter({
    options: metadata.ukRegionOptions,
    value: queryParams.uk_region,
    categoryLabel: labels.UK_REGION,
  }),
  selectedCompanyStatuses: buildOptionsFilter({
    options: COMPANY_STATUS_OPTIONS,
    value: queryParams.archived,
    categoryLabel: labels.COMPANY_STATUS,
  }),
  selectedExportToCountries: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.export_to_countries,
    categoryLabel: labels.CURRENTLY_EXPORTING_TO,
  }),
  selectedFutureCountriesOfInterest: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.future_interest_countries,
    categoryLabel: labels.FUTURE_COUNTRIES_OF_INTEREST,
  }),
})
