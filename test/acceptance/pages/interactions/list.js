const {
  getSelectorForElementWithText,
  getMetaListItemValueSelector,
} = require('../../helpers/selectors')

const getFilterTagSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-collection__filter-label',
  }
)

module.exports = {
  url: `${process.env.QA_HOST}/interactions`,
  elements: {
    interactionsTab: 'a[href*="/search/interactions"]',
  },
  sections: {
    filterTags: {
      selector: '.c-collection__filter-summary',
      elements: {
        kind: getFilterTagSelector('Kind'),
        communicationChannel: getFilterTagSelector('Communication channel'),
        adviser: getFilterTagSelector('Adviser'),
        dateFrom: getFilterTagSelector('From'),
        dateTo: getFilterTagSelector('To'),
        seviceProvider: getFilterTagSelector('Service provider'),
      },
    },
    firstInteractionInList: {
      selector: '.c-entity-list li:nth-child(1)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },

        subject: getMetaListItemValueSelector('Subject'),
        type: getMetaListItemValueSelector('Type'),
        contact: getMetaListItemValueSelector('Contact'),
        company: getMetaListItemValueSelector('Company'),
        channel: getMetaListItemValueSelector('Channel'),
        adviser: getMetaListItemValueSelector('Adviser'),
        serviceProvider: getMetaListItemValueSelector('Service provider'),
        teamSearch: getMetaListItemValueSelector('Teams'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        interaction: 'label[for=field-kind-1]',
        serviceDelivery: 'label[for=field-kind-2]',
        policyFeedback: 'label[for=field-kind-3]',
        communicationChannel: '[name="communication_channel"]',
        adviser: '[name="dit_adviser"]',
        dateFrom: '#field-date_after',
        dateTo: '#field-date_before',
        serviceProvider: '[name="dit_team"]',
        teamSearch: '#dit_team__typeahead .multiselect__input',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        sortBy: '#field-sortby',
      },
    },
  },
}
