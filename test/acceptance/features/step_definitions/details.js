const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')
const { get, includes, startsWith, keys } = require('lodash')

const { getKeyValueTableRowValueCell, getDataTableRowCell } = require('../../helpers/selectors')
const formatters = require('../../helpers/formatters')

const Details = client.page.details()

const getRowCellSelector = {
  'key-value': getKeyValueTableRowValueCell,
  'data': getDataTableRowCell,
}

const ignoredKeys = [
  'Business type', // todo: case issues
  'Sector', // todo: https://uktrade.atlassian.net/browse/DH-1086
]

const TABLE_TYPE = {
  KEY_VALUE: 'key-value',
  DATA: 'data',
}

function getExpected (key, state) {
  if (includes(key, '.') && !includes(key, ' ') && !startsWith(key, '£')) {
    const expectedText = get(state, key)

    if (key === 'investmentProject.clientContact') {
      // contact in investmentProjects create form has ', job_title` appended, this split removes that to run this check
      return { value: expectedText.split(',')[0] }
    }

    return { value: expectedText }
  }

  return { value: key }
}

const removeFalsey = (details, state) => {
  return details.filter((detail) => {
    const hasValue = /\D(\.)\D/gi.test(detail.value)
      ? get(state, detail.value)
      : detail.value

    return hasValue
  })
}

const assertTableRowCount = async function (tableSelector, expectedData, tableType) {
  await Details.api.elements('xpath', `${tableSelector.selector}/tbody/tr`, (result) => {
    client.expect(result.value.length, 'Table row count').to.equal(expectedData.length)
  })
}

const assertTableContent = async function (tableSelector, expectedData, tableType) {
  for (const row of expectedData) {
    const columnKeys = keys(row)
    const rowFirstCellKey = columnKeys[0]

    for (const [columnIndex, columnKey] of columnKeys.entries()) {
      if (includes(ignoredKeys, row[rowFirstCellKey]) || columnIndex === 0 || columnKey === 'formatter') {
        continue
      }

      const rowCellSelector = getRowCellSelector[tableType](row[rowFirstCellKey], columnIndex)
      const tableRowCellXPathSelector = tableSelector.selector + rowCellSelector.selector
      const expected = getExpected(row[columnKey], this.state)
      await Details
        .api.useXpath()
        .waitForElementPresent(tableRowCellXPathSelector)
        .getText(tableRowCellXPathSelector, (actual) => {
          if (row.formatter) {
            return client.expect(formatters[row.formatter](expected.value, actual.value), row[rowFirstCellKey]).to.be.true
          }
          client.expect(actual.value, row[rowFirstCellKey]).to.equal(expected.value)
        })
        .useCss()
    }
  }
}

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

Then(/^details content heading should contain "(.+)"$/, async (value) => {
  await Details
    .waitForElementPresent('@contentHeading')
    .assert.containsText('@contentHeading', value)
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

Then(/^the (.+) key value details are displayed$/, async function (tableTitle, dataTable) {
  const expectedKeyValues = removeFalsey(dataTable.hashes(), this.state)
  const tableSelector = Details.getSelectorForKeyValueTable(tableTitle)

  await assertTableRowCount(tableSelector, expectedKeyValues, TABLE_TYPE.KEY_VALUE)
  await assertTableContent.bind(this)(tableSelector, expectedKeyValues, TABLE_TYPE.KEY_VALUE)
})

Then(/^the (.+) key value details are not displayed$/, async function (tableTitle) {
  const tableSelector = Details.getSelectorForKeyValueTable(tableTitle)

  await Details
    .api.useXpath()
    .assert.elementNotPresent(tableSelector.selector)
    .useCss()
})

Then(/^the key value details are displayed$/, async function (dataTable) {
  const expectedKeyValues = removeFalsey(dataTable.hashes(), this.state)
  const tableSelector = Details.getSelectorForKeyValueTable()

  await assertTableRowCount(tableSelector, expectedKeyValues, TABLE_TYPE.KEY_VALUE)
  await assertTableContent.bind(this)(tableSelector, expectedKeyValues, TABLE_TYPE.KEY_VALUE)
})

Then(/^the (.+) data details are displayed$/, async function (tableTitle, dataTable) {
  const tableSelector = Details.getSelectorForDataTable(tableTitle)

  await assertTableRowCount(tableSelector, dataTable.hashes(), TABLE_TYPE.DATA)
  await assertTableContent.bind(this)(tableSelector, dataTable.hashes(), TABLE_TYPE.DATA)
})
