import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'

import { STATUS_OPTIONS, LABELS } from './constants'

export const buildSelectedFilters = (
  {
    name,
    company_name,
    company_sector_descends,
    address_country,
    company_uk_region,
    archived,
  },
  {
    sectorOptions,
    countryOptions,
    ukRegionOptions,
    statusOptions = STATUS_OPTIONS,
  }
) => ({
  selectedName: buildInputFieldFilter({
    value: name,
    label: name,
    categoryLabel: LABELS.contactName,
  }),
  selectedCompanyName: buildInputFieldFilter({
    value: company_name,
    categoryLabel: LABELS.companyName,
  }),
  selectedCompanySectors: buildOptionsFilter({
    options: sectorOptions,
    value: company_sector_descends,
    categoryLabel: LABELS.sector,
  }),
  selectedAddressCountries: buildOptionsFilter({
    options: countryOptions,
    value: address_country,
    categoryLabel: LABELS.country,
  }),
  selectedCompanyUkRegions: buildOptionsFilter({
    options: ukRegionOptions,
    value: company_uk_region,
    categoryLabel: LABELS.ukRegion,
  }),
  selectedStatus: buildOptionsFilter({
    options: statusOptions,
    value: archived,
    categoryLabel: LABELS.status,
  }),
})