const {
  getSelectorForElementWithText,
  getButtonWithText,
  getListItemMetaElementWithText,
} = require('../helpers/selectors')

const getSelectorForMetaListItemValue = (text) => {
  return getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })
}

module.exports = {
  commands: [
    {
      getSelectorForMetaListItemValue,
      getSelectorForBadgeWithText (text) {
        return getListItemMetaElementWithText(text)
      },
      getButtonSelectorWithText (text) {
        return getButtonWithText(text)
      },
      captureResultCount (callback) {
        return this.section.collectionHeader
          .waitForElementVisible('@resultCount')
          .getText('@resultCount', (result) => {
            callback(result.value)
          })
      },
    },
  ],
  sections: {
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        intro: '.c-collection__header-intro',
        paginationSummary: '.c-collection__pagination-summary',
        resultCount: '.c-collection__result-count',
        removeAllFiltersLink: '.c-collection__filter-remove-all',
      },
    },
    firstCollectionItem: {
      selector: '.c-collection > .c-entity-list li:first-child',
      elements: {
        header: '.c-entity__title',
        subHeader: '.c-entity__subtitle',
      },
    },
    filters: {
      selector: '.c-collection-filters',
    },
  },
}
