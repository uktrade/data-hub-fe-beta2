const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get, set, camelCase, fromPairs, map, capitalize } = require('lodash')

const { getDateFor } = require('../../../helpers/date')

const Interaction = client.page.interactions.interaction()
const InteractionList = client.page.interactions.list()

When(/^[an]{1,2} (interaction|service delivery) is added$/, async function (kind, dataTable) {
  const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
  await Interaction
    .createInteraction(details, kind === 'service delivery', (interaction) => {
      set(this.state, 'interaction', interaction)
      set(this.state, 'interaction.date', getDateFor({
        year: get(this.state, 'interaction.dateOfInteractionYear'),
        month: get(this.state, 'interaction.dateOfInteractionMonth'),
        day: get(this.state, 'interaction.dateOfInteractionDay'),
      }))
      set(this.state, 'interaction.type', capitalize(kind))
    })
    .wait() // wait for backend to sync
})

When(/^a policy feedback is added$/, async function (dataTable) {
  const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
  await Interaction
    .createPolicyFeedback(details, (interaction) => {
      set(this.state, 'interaction', interaction)
      set(this.state, 'interaction.date', getDateFor({
        year: get(this.state, 'interaction.dateOfInteractionYear'),
        month: get(this.state, 'interaction.dateOfInteractionMonth'),
        day: get(this.state, 'interaction.dateOfInteractionDay'),
      }))
      set(this.state, 'interaction.type', 'Policy feedback')
    })
    .wait() // wait for backend to sync
})

When(/^I select interaction$/, async function () {
  await Interaction
    .waitForElementVisible('@continueButton')
    .click('@aStandardInteraction')
    .click('@continueButton')
})

When(/^I select policy feedback$/, async function () {
  await Interaction
    .waitForElementVisible('@continueButton')
    .click('@aPolicyFeedback')
    .click('@continueButton')
})

When(/^I select service delivery$/, async function () {
  await Interaction
    .waitForElementVisible('@continueButton')
    .click('@aServiceThatYouHaveProvided')
    .click('@continueButton')
})

When(/^the interaction events Yes option is chosen$/, async function () {
  await Interaction
    .setValue('@eventYes', '')
    .click('@eventYes')
})

When(/^the interaction events No option is chosen$/, async function () {
  await Interaction
    .setValue('@eventNo', '')
    .click('@eventNo')
})

Then(/^there are interaction fields$/, async function () {
  await Interaction
    .waitForElementVisible('@contact')
    .assert.visible('@contact')
    .assert.visible('@serviceProvider')
    .assert.visible('@ditAdviser')
    .assert.elementNotPresent('@eventYes')
    .assert.elementNotPresent('@eventNo')
    .assert.elementNotPresent('@event')
    .assert.visible('@service')
    .assert.elementNotPresent('@serviceStatus')
    .assert.elementNotPresent('@grantOffered')
    .assert.elementNotPresent('@netReceipt')
    .assert.visible('@subject')
    .assert.visible('@notes')
    .assert.visible('@dateOfInteractionYear')
    .assert.visible('@dateOfInteractionMonth')
    .assert.visible('@dateOfInteractionDay')
    .assert.visible('@communicationChannel')
    .assert.elementNotPresent('@policyIssueType')
    .assert.elementNotPresent('@policyArea')
})

Then(/^there are service delivery fields$/, async function () {
  await Interaction
    .waitForElementVisible('@contact')
    .assert.visible('@contact')
    .assert.visible('@serviceProvider')
    .assert.visible('@ditAdviser')
    .assert.visible('@eventYes')
    .assert.visible('@eventNo')
    .assert.elementPresent('@event')
    .assert.visible('@service')
    .assert.hidden('@serviceStatus')
    .assert.hidden('@grantOffered')
    .assert.hidden('@netReceipt')
    .assert.visible('@subject')
    .assert.visible('@notes')
    .assert.visible('@dateOfInteractionYear')
    .assert.visible('@dateOfInteractionMonth')
    .assert.visible('@dateOfInteractionDay')
    .assert.elementNotPresent('@communicationChannel')
    .assert.elementNotPresent('@policyIssueType')
    .assert.elementNotPresent('@policyArea')
})

Then(/^there are policy feedback fields$/, async function () {
  await Interaction
    .waitForElementVisible('@contact')
    .assert.visible('@contact')
    .assert.visible('@serviceProvider')
    .assert.visible('@policyIssueType')
    .assert.visible('@policyArea')
    .assert.visible('@subject')
    .assert.visible('@notes')
    .assert.visible('@dateOfInteractionYear')
    .assert.visible('@dateOfInteractionMonth')
    .assert.visible('@dateOfInteractionDay')
    .assert.visible('@ditAdviser')
    .assert.visible('@communicationChannel')
    .assert.elementNotPresent('@eventYes')
    .assert.elementNotPresent('@eventNo')
    .assert.elementNotPresent('@event')
    .assert.elementNotPresent('@serviceStatus')
    .assert.elementNotPresent('@grantOffered')
    .assert.elementNotPresent('@netReceipt')
})

Then(/^(interaction|policy feedback) fields are pre-populated$/, async function (kind) {
  const assertIsSet = (result) => client.expect(result.value.length).to.be.greaterThan(0)
  // TODO test user does not have a DIT team
  // await Interaction.getValue('@serviceProvider', assertIsSet)
  await Interaction.getValue('@dateOfInteractionYear', assertIsSet)
  await Interaction.getValue('@dateOfInteractionMonth', assertIsSet)
  await Interaction.getValue('@dateOfInteractionDay', assertIsSet)
  await Interaction.getValue('@ditAdviser', assertIsSet)
})

Then(/^the interaction events is displayed$/, async function () {
  await Interaction
    .assert.visible('@event')
})

Then(/^the interaction events is not displayed$/, async function () {
  await Interaction
    .assert.hidden('@event')
})

Then(/^the service fields are visible$/, async function () {
  await Interaction
    .waitForElementVisible('@serviceStatus')
    .assert.visible('@serviceStatus')
    .assert.visible('@grantOffered')
})

Then(/^the service fields are hidden/, async function () {
  await Interaction
    .waitForElementPresent('@serviceStatus')
    .assert.hidden('@serviceStatus')
    .assert.hidden('@grantOffered')
})

Then(/^the net receipt field is visible$/, async function () {
  await Interaction
    .waitForElementVisible('@netReceipt')
    .assert.visible('@netReceipt')
})

Then(/^the net receipt field is hidden/, async function () {
  await Interaction
    .waitForElementPresent('@netReceipt')
    .assert.hidden('@netReceipt')
})

/**
 * The filtering available for Interactions, Service Delivery or Policy feedback is particularly hard to pin down a specific
 * Interaction, Service Delivery or Policy feedback - this is by design. The filtering here combined with random dates for creation
 * of an Interaction, Service Delivery or Polcy feedback should mean we always find what we are looking for in the first
 * result of the Collection.
 */
Then(/^I filter the collections to view the (.+) I have just created$/, async function (typeOfInteraction) {
  const filtersSection = InteractionList.section.filters
  const filterTagsSection = InteractionList.section.filterTags
  const waitForTimeout = 15000
  const interactionType = camelCase(typeOfInteraction)
  const date = getDateFor({
    year: get(this.state, 'interaction.dateOfInteractionYear'),
    month: get(this.state, 'interaction.dateOfInteractionMonth'),
    day: get(this.state, 'interaction.dateOfInteractionDay'),
  }, 'YYYY-M-D')

  await filtersSection
    .waitForElementPresent(`@${interactionType}`)
    .click(`@${interactionType}`)

  await filterTagsSection
    .waitForElementPresent('@kind', waitForTimeout)

  await filtersSection
    .setValue('@dateFrom', date)
    .sendKeys('@dateFrom', [ client.Keys.ENTER ])

  await filterTagsSection
    .waitForElementPresent('@dateFrom', waitForTimeout)

  await filtersSection
    .setValue('@dateTo', date)
    .sendKeys('@dateTo', [ client.Keys.ENTER ])

  await filterTagsSection
    .waitForElementPresent('@dateTo', waitForTimeout)
})
