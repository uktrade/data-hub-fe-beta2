import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'

import {
  SECTOR,
  COUNTRY,
  UK_REGION,
  CONTACTS_NAME,
  COMPANY_NAME,
  STATUS,
} from './labels'

import { STATUS_OPTIONS } from './metadata'

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
    categoryLabel: CONTACTS_NAME,
  }),
  selectedCompanyName: buildInputFieldFilter({
    value: company_name,
    categoryLabel: COMPANY_NAME,
  }),
  selectedCompanySectors: buildOptionsFilter({
    options: sectorOptions,
    value: company_sector_descends,
    categoryLabel: SECTOR,
  }),
  selectedAddressCountries: buildOptionsFilter({
    options: countryOptions,
    value: address_country,
    categoryLabel: COUNTRY,
  }),
  selectedCompanyUkRegions: buildOptionsFilter({
    options: ukRegionOptions,
    value: company_uk_region,
    categoryLabel: UK_REGION,
  }),
  selectedStatus: buildOptionsFilter({
    options: statusOptions,
    value: archived,
    categoryLabel: STATUS,
  }),
})
