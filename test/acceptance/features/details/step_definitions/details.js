const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, includes } = require('lodash')

const { getDetailsTableRowValue } = require('../../../helpers/selectors')

const formatters = {
  formatEuropeanOrGlobalHeadquarters (value) {
    return /^(european|global) headquarters$/i.test(value) ? 'Yes' : 'No'
  },
}

function getExpectedValue (row, state) {
  if (includes(row.value, '.') && !includes(row.value, ' ')) {
    const expectedText = get(state, row.value)

    if (row.key === 'Client contacts') {
      // contact in investmentProjects create form has ', job_title` appended, this split removes that to run this check
      return expectedText.split(',')[0]
    }

    return expectedText
  }

  return row.value
}

function formatExpectedValue (row, expectedValue) {
  return row.format ? formatters[row.format](expectedValue) : expectedValue
}

defineSupportCode(({ Then }) => {
  const Details = client.page.Details()

  Then(/^details heading should contain what I entered for "(.+)" field$/, async function (fieldName) {
    await Details
      .waitForElementPresent('@heading')
      .assert.containsText('@heading', this.state[fieldName])
  })

  Then(/^details heading should contain "(.+)"$/, async (value) => {
    await Details
      .waitForElementPresent('@heading')
      .assert.containsText('@heading', value)
  })

  Then(/^details view data for "(.+)" should contain what I entered for "(.+)" field$/, async function (detailsItemName, fieldName) {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details
      .api.useXpath()
      .waitForElementPresent(detail.selector)
      .assert.containsText(detail.selector, this.state[fieldName])
      .useCss()
  })

  Then(/^details view data for "(.+)" should contain "(.+)"$/, async (detailsItemName, value) => {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details
      .api.useXpath()
      .waitForElementPresent(detail.selector)
      .assert.containsText(detail.selector, value)
      .useCss()
  })

  Then(/^there should be a local nav$/, async (dataTable) => {
    const expectedLocalNav = dataTable.hashes()

    await Details.api.elements('css selector', '.c-local-nav__link', (result) => {
      client.expect(result.value.length).to.equal(expectedLocalNav.length)
    })

    for (const row of expectedLocalNav) {
      const localNavItemSelector = Details.getLocalNavItemSelector(row.text)
      await Details
        .api.useXpath()
        .waitForElementPresent(localNavItemSelector.selector)
        .assert.visible(localNavItemSelector.selector)
        .useCss()
    }
  })

  Then(/^there should not be a local nav$/, async () => {
    await Details
      .assert.elementNotPresent('@localNav')
  })

  Then(/^view should (not\s?)?contain the Documents link$/, async (noDocumentsLink) => {
    const tag = noDocumentsLink ? '@noDocumentsMessage' : '@documentsLink'

    await Details
      .waitForElementPresent(tag)
      .assert.visible(tag)
  })

  Then(/^the (.+) details are displayed$/, async function (detailsTableTitle, dataTable) {
    const expectedDetails = dataTable.hashes()
    const detailsTableSelector = Details.getSelectorForDetailsTableWithTitle(detailsTableTitle)

    await Details.api.elements('xpath', `${detailsTableSelector.selector}//th`, (result) => {
      client.expect(result.value.length).to.equal(expectedDetails.length)
    })

    for (const row of expectedDetails) {
      if (row.key === 'Business type') {
        // todo: case issues
        continue
      }
      if (row.key === 'Sector') {
        // todo: https://uktrade.atlassian.net/browse/DH-1086
        continue
      }

      const rowValueSelector = getDetailsTableRowValue(row.key)
      const detailsTableRowValueXPathSelector = detailsTableSelector.selector + rowValueSelector.selector
      const expectedValue = getExpectedValue(row, this.state)
      const formattedExpectedValue = formatExpectedValue(row, expectedValue)
      await Details
        .api.useXpath()
        .waitForElementPresent(detailsTableRowValueXPathSelector)
        .assert.containsText(detailsTableRowValueXPathSelector, formattedExpectedValue)
        .useCss()
    }
  })
})
