import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'

import { STATUS_OPTIONS } from './constants'

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
    categoryLabel: 'Contact name',
  }),
  selectedCompanyName: buildInputFieldFilter({
    value: company_name,
    categoryLabel: 'Company name',
  }),
  selectedCompanySectors: buildOptionsFilter({
    options: sectorOptions,
    value: company_sector_descends,
    categoryLabel: 'Sector',
  }),
  selectedAddressCountries: buildOptionsFilter({
    options: countryOptions,
    value: address_country,
    categoryLabel: 'Country',
  }),
  selectedCompanyUkRegions: buildOptionsFilter({
    options: ukRegionOptions,
    value: company_uk_region,
    categoryLabel: 'UK region',
  }),
  selectedStatus: buildOptionsFilter({
    options: statusOptions,
    value: archived,
    categoryLabel: 'Status',
  }),
})
