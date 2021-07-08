export const LABELS = {
  status: 'Status',
  sector: 'Sector',
  country: 'Country',
  ukRegion: 'UK region',
  contactName: 'Contact name',
  companyName: 'Company name',
}

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'false' },
  { label: 'Inactive', value: 'true' },
]

export const SORT_OPTIONS = [
  { value: 'created_on:desc', name: 'Recently created' },
  { value: 'created_on:asc', name: 'Oldest' },
  { value: 'modified_on:desc', name: 'Recently updated' },
  { value: 'modified_on:asc', name: 'Least recently updated' },
  { value: 'last_name:asc', name: 'Last name A-Z' },
  { value: 'address_country.name:asc', name: 'Country A-Z' },
  { value: 'company.name:asc', name: 'Company A-Z' },
]
