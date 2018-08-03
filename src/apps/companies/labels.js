const companyDetailsLabels = {
  business_type: 'Business type',
  name: 'Name',
  registered_address: 'Primary address',
  trading_name: 'Trading name',
  trading_address: 'Trading address',
  uk_region: 'UK region',
  headquarter_type: 'Headquarter type',
  global_headquarters: 'Global HQ',
  sector: 'Sector',
  website: 'Website',
  description: 'Business description',
  employee_range: 'Number of employees',
  turnover_range: 'Annual turnover',
  trading_address_1: 'Trading address street',
  trading_address_2: 'Trading address street',
  trading_address_town: 'Trading address town',
  trading_address_county: 'Trading address county',
  trading_address_postcode: 'Trading address postcode',
  trading_address_country: 'Trading address country',
  registered_address_1: 'Registered address street',
  registered_address_2: 'Registered address street',
  registered_address_town: 'Registered address town',
  registered_address_county: 'Registered address county',
  registered_address_postcode: 'Registered address postcode',
  registered_address_country: 'Registered address country',
  subsidiaries: 'Subsidiaries',
  link_a_subsidiary: 'Link a subsidiary',
  link_subsidiary: 'Link subsidiary',
  country: 'Country',
  business_type_for_other: 'Type of organisation',
  business_type_uk_other: 'Type of organisation',
  archived: 'Archived status',
  archived_on: 'Archive date',
  archived_reason: 'Archived reason',
  archived_by_id: 'Archived by',
  company_number: 'Companies House number',
  account_manager: 'Account manager',
  vat_number: 'VAT number',
  reference_code: 'CDMS reference',
}
const chDetailsLabels = {
  name: 'Registered name',
  company_number: 'Companies House No',
  registered_address: 'Registered office address',
  business_type: 'Company type',
  company_status: 'Company status',
  incorporation_date: 'Incorporated on',
  sic_code: 'Nature of business (SIC)',
}

const address = {
  companyRegisteredAddress: 'Primary address',
  companyTradingAddress: 'Trading address',
  companiesHouseRegisteredAddress: 'Registered address',
}

const companyTypeOptions = {
  ltd: 'UK private or public limited company',
  ukother: 'Other type of UK organisation',
  foreign: 'Foreign organisation',
}

const hqLabels = {
  ehq: 'European HQ',
  ghq: 'Global HQ',
  ukhq: 'UK HQ',
}

const accountManagementDisplayLabels = {
  one_list_tier: 'One List tier',
  one_list_account_owner: 'Global account manager',
}

const exportDetailsLabels = {
  exportExperienceCategory: 'Export win category',
  exportToCountries: 'Currently exporting to',
  futureInterestCountries: 'Future countries of interest',
}

const coreTeamLabels = {
  region: 'Region',
  country: 'Country',
  team: 'Team',
}

module.exports = {
  companyDetailsLabels,
  chDetailsLabels,
  companyTypeOptions,
  hqLabels,
  accountManagementDisplayLabels,
  exportDetailsLabels,
  address,
  coreTeamLabels,
}
