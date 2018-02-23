const moment = require('moment')
const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get, set } = require('lodash')

const CompanyList = client.page.companies.List()

When(/^I click on the first company collection link$/, async function () {
  await CompanyList
    .section.firstCompanyInList
    .waitForElementVisible('@header')
    .click('@header')
})

When(/^I filter the companies list by company/, async function () {
  await CompanyList.section.filters
    .waitForElementPresent('@company')
    .setValue('@company', this.state.company.uniqueSearchTerm)
    .sendKeys('@company', [ client.Keys.ENTER ])
    .wait() // wait for xhr
})

When(/^I filter the companies list by sector$/, async function () {
  await CompanyList.section.filters
    .waitForElementPresent('@sector')
    .clickMultipleChoiceOption('sector', this.state.company.sector)
    .wait() // wait for xhr
})

When(/^I filter the companies list by country$/, async function () {
  await CompanyList.section.filters
    .waitForElementPresent('@country')
    .clickMultipleChoiceOption('country', this.state.company.country)
    .wait() // wait for xhr
})

When(/^I filter the companies list by UK region/, async function () {
  await CompanyList.section.filters
    .waitForElementPresent('@ukRegion')
    .clickMultipleChoiceOption('uk_region', this.state.company.ukRegion)
    .wait() // wait for xhr
})

When(/^the companies are sorted by (Company name: A-Z|Recently updated)$/, async function (sortOption) {
  await CompanyList
    .section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await CompanyList
    .section.firstCompanyInList
    .waitForElementPresent('@header')
    .getText('@header', (result) => {
      set(this.state, 'list.firstItem.field', result.value)
    })

  await CompanyList
    .section.secondCompanyInList
    .waitForElementPresent('@header')
    .getText('@header', (result) => {
      set(this.state, 'list.secondItem.field', result.value)
    })
})

When(/^the companies are sorted by (Least recently updated)$/, async function (sortOption) {
  await CompanyList
    .section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await CompanyList
    .section.firstCompanyInList
    .waitForElementPresent('@header')
    .getText('@header', (result) => {
      set(this.state, 'list.lastItem.field', result.value)
    })
})

Then(/^the companies should be filtered by company name/, async function () {
  const expected = get(this.state, `company.heading`)

  await CompanyList
    .section.firstCompanyInList
    .waitForElementVisible('@header')
    .assert.containsText('@header', expected)
})

Then(/^the companies should be filtered by company sector$/, async function () {
  const expected = get(this.state, `company.sector`)

  await CompanyList
    .section.firstCompanyInList
    .waitForElementVisible('@companySector')
    .assert.containsText('@companySector', expected)
})

Then(/^the companies should be filtered to show badge company country$/, async function () {
  const expectedBadgeText = get(this.state, 'company.country')

  await CompanyList
    .section.firstCompanyInList
    .waitForElementVisible('@countryBadge')
    .assert.containsText('@countryBadge', expectedBadgeText)
})

Then(/^the companies should be filtered to show badge company UK region/, async function () {
  const expectedBadgeText = get(this.state, 'company.ukRegion')

  await CompanyList
    .section.firstCompanyInList
    .waitForElementVisible('@ukRegionBadge')
    .assert.containsText('@ukRegionBadge', expectedBadgeText)
})

// TODO potentially abstract this out to collections
Then(/^the companies should be sorted by (Least recently|Recently) updated$/, async function (sortType) {
  const updateValues = {
    firstItem: null,
    secondItem: null,
  }

  await CompanyList
    .section.firstCompanyInList
    .waitForElementPresent('@subHeader')
    .getText('@subHeader', (result) => {
      const date = moment(result.value.substr(11), 'D MMM YYYY, h:mma')
      set(updateValues, 'firstItem', date)
    })

  await CompanyList
    .section.secondCompanyInList
    .waitForElementPresent('@subHeader')
    .getText('@subHeader', (result) => {
      const date = moment(result.value.substr(11), 'D MMM YYYY, h:mma')
      set(updateValues, 'secondItem', date)
    })

  if (sortType === 'Recently') {
    client.expect(updateValues.firstItem.isSameOrAfter(updateValues.secondItem)).to.be.true
  }

  if (sortType === 'Least recently') {
    client.expect(updateValues.firstItem.isSameOrBefore(updateValues.secondItem)).to.be.true
  }
})
