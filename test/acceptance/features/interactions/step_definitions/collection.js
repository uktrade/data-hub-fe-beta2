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

  console.log('State before', this.state.interaction.serviceProvider)
})

Then(/^the interactions should be filtered by service provider$/, async function () {
  const selector = '@serviceProvider'
  const expected = get(this.state, `interaction.serviceProvider`)

  await InteractionList
    .section.firstInteractionInList
    .waitForElementVisible(selector)
    .assert.containsText(selector, expected)
})
