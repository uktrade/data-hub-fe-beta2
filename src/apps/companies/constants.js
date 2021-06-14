const { concat } = require('lodash')

const QUERY_FIELDS_MAP = {
  leadIta: 'one_list_group_global_account_manager',
  archived: 'archived',
  name: 'name',
  sectorDescends: 'sector_descends',
  country: 'country',
  ukRegion: 'uk_region',
  headquarterType: 'headquarter_type',
  exportingTo: 'export_to_countries',
  interestedIn: 'future_interest_countries',
  lastInteractionDate: 'interaction_between',
  ukPostcode: 'uk_postcode',
  area: 'area',
}

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  [QUERY_FIELDS_MAP.archived]: false,
}

const GLOBAL_NAV_ITEM = {
  path: '/companies',
  headerKey: 'datahub-companies',
  permissions: ['company.view_company'],
  key: 'datahub-crm',
  order: 1,
}

const LOCAL_NAV = [
  {
    path: 'activity',
    label: 'Activity',
    permissions: ['interaction.view_all_interaction'],
  },
  {
    path: 'contacts',
    label: 'Company contacts',
    permissions: ['company.view_contact'],
  },
  {
    path: 'advisers',
    label: 'Lead adviser',
  },
  {
    path: 'investments',
    label: 'Investment',
    permissions: [
      'investment.view_all_investmentproject',
      'investment.view_associated_investmentproject',
    ],
    ariaDescription: 'Company investments',
  },
  {
    path: 'exports',
    label: 'Export',
    permissions: ['company.view_companyexportcountry'],
  },
  {
    path: 'orders',
    label: 'Orders',
    permissions: ['order.view_order'],
    ariaDescription: 'Company orders',
  },
]

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)
const QUERY_FIELDS = Object.values(QUERY_FIELDS_MAP)
const NONE_TEXT = 'None'
const NOT_SET_TEXT = 'Not set'
const NOT_AVAILABLE_TEXT = 'Not available'

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_FIELDS_MAP,
  NONE_TEXT,
  NOT_SET_TEXT,
  NOT_AVAILABLE_TEXT,
}
