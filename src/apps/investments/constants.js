const { concat } = require('lodash')
const { root } = require('./paths')

const GLOBAL_NAV_ITEM = {
  path: root,
  headerKey: 'datahub-investments',
  permissions: [
    'investment.view_associated_investmentproject',
    'investment.view_all_investmentproject',
  ],
  key: 'datahub-crm',
  order: 5,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Project details',
  },
  {
    path: 'team',
    label: 'Project team',
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.view_associated_investmentproject_interaction',
      'interaction.view_all_interaction',
    ],
  },
  {
    path: 'propositions',
    label: 'Propositions',
    permissions: [
      'proposition.view_associated_investmentproject_proposition',
      'proposition.view_all_proposition',
      'proposition.view_associated_proposition',
    ],
  },
  {
    path: 'evaluation',
    label: 'Evaluations',
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
  {
    path: 'documents',
    label: 'CDMS documents',
    permissions: ['investment.view_investmentproject_document'],
  },
  {
    path: 'evidence',
    label: 'Evidence',
  },
  {
    path: 'admin',
    label: 'Admin',
  },
]

const INVESTMENT_TAB_ITEMS = [
  {
    path: 'projects',
    label: 'Projects',
  },
  {
    path: 'profiles',
    label: 'Investor profiles',
  },
]

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'estimated_land_date:asc',
}

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

const QUERY_FIELDS = [
  'status',
  'adviser',
  'sector_descends',
  'investor_company_country',
  'uk_region_location',
  'stage',
  'investment_type',
  'investor_company',
  'proposal_deadline_before',
  'proposal_deadline_after',
  'client_relationship_manager',
  'likelihood_to_land',
  'level_of_involvement_simplified',
]

const QUERY_DATE_FIELDS = [
  'estimated_land_date_before',
  'estimated_land_date_after',
  'actual_land_date_before',
  'actual_land_date_after',
  'client_relationship_manager',
  'likelihood_to_land',
]

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  INVESTMENT_TAB_ITEMS,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
}
