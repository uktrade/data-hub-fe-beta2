const { lowerCase } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

const getSelectorForMetaListItemValue = (text) => {
  return getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })
}

module.exports = {
  elements: {
    pagination: '.c-pagination',
    filterTags: '.c-collection__filter-tag',
  },
  commands: [
    {
      getSelectorForResultsCountHeader (collectionType) {
        return getSelectorForElementWithText(
          lowerCase(collectionType),
          {
            el: '//div',
            className: 'c-collection__header-intro',
          }
        )
      },
      getSelectorForMetaListItemValue,
      getSelectorForBadgeWithText (text) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//article[contains(@class, "c-collection")]//ol[contains(@class,"c-entity-list")]/li[1]//span',
            className: 'c-meta-list__item-label',
            child: '/following-sibling::span',
          },
        )
      },
      getButtonSelectorWithText (text) {
        return getButtonWithText(text)
      },
    },
  ],
  sections: {
    localHeader: {
      selector: '.c-local-header',
      elements: {
        header: 'h1.c-local-header__heading',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        paginationSummary: '.c-collection__pagination-summary',
        resultCount: '.c-collection__result-count',
      },
    },
    firstCollectionItem: {
      selector: '.c-collection > .c-entity-list li:first-child',
      elements: {
        header: '.c-entity__title',
        updated: getSelectorForMetaListItemValue('Updated'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
    },
  },
}
