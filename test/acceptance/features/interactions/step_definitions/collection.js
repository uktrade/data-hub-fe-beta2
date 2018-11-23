// Todo The acceptance tests with the typeahead Vue component needs looking into as setting values with nightwatch in the search field does not work

const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get } = require('lodash')

const InteractionList = client.page.interactions.list()
When(/^I filter the interactions list by service provider$/, async function () {
  await InteractionList.section.filters
    .waitForElementPresent('@teamSearch')
    .setValue('@teamSearch', this.state.interaction.serviceProvider)
    .sendKeys('@teamSearch', [ client.Keys.ENTER ])
    .wait() // wait for xhr
})

Then(/^the interactions should be filtered by service provider$/, async function () {
  const selector = '@serviceProvider'
  const expected = get(this.state, `interaction.serviceProvider`)

  await InteractionList
    .section.firstInteractionInList
    .waitForElementVisible(selector)
    .assert.containsText(selector, expected)
})
