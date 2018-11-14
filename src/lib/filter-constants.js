const FILTER_CONSTANTS = {
  COMPANIES: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
      MAX_EXPORT_ITEMS: 5000,
    },
  },
  CONTACTS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'company_sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
      MAX_EXPORT_ITEMS: 5000,
    },
  },
  INVESTMENT_PROJECTS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
      MAX_EXPORT_ITEMS: 5000,
    },
  },
  INTERACTIONS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
      MAX_EXPORT_ITEMS: 5000,
    },
  },
  ORDERS: {
    MAX_EXPORT_ITEMS: 5000,
  },
}

module.exports = FILTER_CONSTANTS
