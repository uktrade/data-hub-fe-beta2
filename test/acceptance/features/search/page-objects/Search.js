const { getSelectorForElementWithText } = require('../../../common/selectors')

const getSearchResultsTabSelector = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//ul//li',
      className: 'c-entity-search__aggregations-item',
    }
  )
const getSearchResultSelector = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//span',
      className: 'c-meta-list__item-label',
      child: '/following-sibling::span',
    }
  )

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    term: '#field-term',
    resultsCount: '.c-collection__result-count',
  },
  sections: {
    tabs: {
      selector: '.c-entity-search__aggregations',
      elements: {
        companies: getSearchResultsTabSelector('Companies'),
        contacts: getSearchResultsTabSelector('Contacts'),
        events: getSearchResultsTabSelector('Events'),
        investmentProjects: getSearchResultsTabSelector('Investment projects'),
        orders: getSearchResultsTabSelector('Orders'),
      },
    },
    firstEventSearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventType: getSearchResultSelector('Type'),
        country: getSearchResultSelector('Country'),
        eventStart: getSearchResultSelector('Begins'),
        eventEnd: getSearchResultSelector('Ends'),
        organiser: getSearchResultSelector('Organiser'),
        leadTeam: getSearchResultSelector('Lead team'),
      },
    },
  },
  commands: [
    {},
  ],
}
