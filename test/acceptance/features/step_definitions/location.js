const { get, camelCase, includes } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')

const formatters = require('../../helpers/formatters')

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

const Location = client.page.location()

When(/^I click the (.+) global nav link/, async (globalNavLinkText) => {
  const globalNavLinkSelector = Location.section.globalNav.getGlobalNavLinkSelector(globalNavLinkText)

  await Location
    .navigate()
    .section.globalNav
    .api.useXpath()
    .waitForElementVisible(globalNavLinkSelector.selector)
    .click(globalNavLinkSelector.selector)
    .useCss()
})

When(/^I click the (.+) local nav link$/, async (localNavLinkText) => {
  const localNavLinkSelector = Location.section.localNav.getLocalNavLinkSelector(localNavLinkText)

  await Location.section.localNav
    .api.useXpath()
    .waitForElementVisible(localNavLinkSelector.selector)
    .click(localNavLinkSelector.selector)
    .useCss()
})

When(/^I click the local header link$/, async () => {
  await Location
    .section.localHeader
    .waitForElementPresent('@headerLink')
    .click('@headerLink')
})

Then(/^I am taken to the "(.+)" page$/, async (text) => {
  await Location
    .section.localHeader
    .waitForElementPresent('@header')
    .assert.containsText('@header', text)
})

Then(/^I confirm I am on the (.+) page$/, async (text) => {
  await Location
    .section.localHeader
    .waitForElementPresent('@header')
    .assert.containsText('@header', text)
})

Then(/^I wait and then refresh the page$/, async () => {
  await client
    .wait()
    .refresh()
})

Then(/^the (.+) local header is displayed$/, async function (entityType, dataTable) {
  const expectedHeading = get(this.state, `${camelCase(entityType)}.name`)
  const expectedHeaderMetas = dataTable.hashes()

  await Location
    .section.localHeader
    .waitForElementPresent('@header')
    .assert.containsText('@header', expectedHeading)

  for (const row of expectedHeaderMetas) {
    const headerMetaValueSelector = Location.section.localHeader.getHeaderMetaValueSelector(row.key).selector
    const expectedValue = getExpectedValue(row, this.state)
    await Location.section.localHeader
      .api.useXpath()
      .waitForElementPresent(headerMetaValueSelector)
      .getText(headerMetaValueSelector, (actual) => {
        if (row.formatter) {
          return client.expect(formatters[row.formatter](expectedValue, actual.value), row.key).to.be.true
        }
        client.expect(actual.value, row.key).to.equal(expectedValue)
      })
      .useCss()
  }
})

Then(/^the heading should be "(.+)"$/, async (value) => {
  await Location
    .section.localHeader
    .waitForElementPresent('@header')
    .assert.containsText('@header', value)
})

Then(/^after the heading should be "(.+)"$/, async (value) => {
  await Location
    .section.localHeader
    .waitForElementPresent('@headerAfter')
    .assert.containsText('@headerAfter', value)
})

Then(/^the heading description should be$/, async (data) => {
  for (const row of data.hashes()) {
    const headerDescriptionParagraphSelector = Location.section.localHeader.getSelectorForHeaderDescriptionParagraph(row.paragraph)

    await Location
      .api.useXpath()
      .waitForElementVisible(headerDescriptionParagraphSelector.selector)
      .useCss()
  }
})

Then(/^I see the ([0-9]+) error page$/, async function (statusCode) {
  const headingSelector = Location.getHeading('//h3', statusCode).selector

  await Location
    .api.useXpath()
    .assert.visible(headingSelector)
    .useCss()
})
