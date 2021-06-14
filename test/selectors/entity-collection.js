module.exports = {
  addCompany: '[data-auto-id="Add company"]',
  addEvent: '[data-auto-id="Add event"]',
  addAttendee: '[data-auto-id="Add attendee"]',
  editEvent: 'a:contains("Edit event")',
  addOrder: '[data-auto-id="Add order"]',
  addProposition: '[data-auto-id="Add proposition"]',
  collection: '.c-collection',
  collectionRowMessage: '.c-collection__export-message',
  collectionRowButton: '.c-collection__header-actions > a',
  collectionRemoveAllFilter: '.c-collection__filter-remove-all',
  collectionResult: '.c-collection__result-count',
  entities: 'article > ol',
  entity: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum})`
  },
  entityBadge: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum}) .c-badge`
  },
  badge: (entityRow, badgeNum) => {
    return `article > ol > li:nth-child(${entityRow}) div.c-meta-list__item:nth-child(${badgeNum}) .c-badge`
  },
  multiSelect: '.c-form-group--AddItems',
  sort: '#field-sortby',
  sortBy: '[name="sortBy"] > select',
  totalValue: '.c-collection__total-cost__value',
}
