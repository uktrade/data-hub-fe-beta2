const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Interaction = client.page.interactions.interaction()

Then('I see the service delivery details', async function () {
  const button = Interaction.getButtonSelectorWithText('Edit service delivery')

  await Interaction
    .api.useXpath()
    .assert.visible(button.selector)
    .useCss()
})
