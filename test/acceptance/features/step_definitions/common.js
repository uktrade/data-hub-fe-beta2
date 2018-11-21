const { assign, camelCase, find, get, set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { When, Then } = require('cucumber')

const fixtures = require('../../fixtures')

When(/^I (?:navigate|go|open|visit).*? `(.+)` page$/, async function (pageName) {
  try {
    const page = get(client.page, pageName)()
    await page.navigate()
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})

When(/^I (?:navigate|go|open|visit).*? `(.+)` page using `(.+)` `(.+)` fixture$/, async function (pageName, entity, fixtureName) {
  const page = get(client.page, pageName)()
  const entityTypeKey = camelCase(entity)
  const fixture = find(fixtures[entityTypeKey], { name: fixtureName })

  if (!fixture) {
    throw new Error(`Fixture ${fixtureName} does not exist`)
  }

  // TODO: Need to find a way to remove needing to store the item in state
  set(this.state, entityTypeKey, assign({}, get(this.state, entityTypeKey), fixture))

  try {
    await page.navigate(page.url(fixtureName))
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})

When(/^I click the "([^"]*)?" (link|button)$/, async function (linkText, type) {
  await client
    .useXpath()
    .click(`//a[text()='${linkText}']`)
    .useCss()
    .wait()
})

When(/^I click `(.+)` on the `(.+)` page$/, async function (elementName, pageName) {
  try {
    const page = get(client.page, pageName)()
    await page.click(`@${elementName}`)
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})

When(/^I select a value for `(.+)` on the `(.+)` page$/, async function (elementName, pageName) {
  try {
    const page = get(client.page, pageName)()
    await page
      .getListOption(`@${elementName}`, (item) => {
        page.setValue(`@${elementName}`, item)
        set(this.state, `${pageName}[${elementName}]`, item)
      })
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})

Then(/^I should not see the "([^"]*)?" (link|button)$/, async function (linkText, type) {
  await client
    .useXpath()
    .assert.elementNotPresent(`//a[text()='${linkText}']`)
    .useCss()
})

Then(/^I should see the "([^"]*)?" (link|button)$/, async function (linkText, type) {
  await client
    .useXpath()
    .assert.elementPresent(`//a[text()='${linkText}']`)
    .useCss()
})

Then(/^I am on the `(.+)` page$/, async function (pageName) {
  try {
    const page = get(client.page, pageName)()

    if (page.props.urlMatch) {
      await client.assert.urlMatch(page.props.urlMatch)
    } else {
      await client.assert.urlContains(page.url)
    }
  } catch (error) {
    throw new Error(error)
  }
})

Then(/^the page should contain text "(.*?)"$/, (text) => {
  return client.expect.element('body').text.to.contain(text)
})

Then(/^I should see the correct text on the `(.+)` page$/, async function (pageName, data) {
  try {
    for (const row of data.hashes()) {
      const elementPath = row.elementPath.split('.')
      const elementName = elementPath.pop()
      const section = elementPath.join('.section.')
      const expectedText = get(this.state, row.expectedText) || row.expectedText
      let page = get(client.page, `${pageName}`)()

      if (section) {
        page = get(page, `section.${section}`)
      }

      await page.assert.containsText(`@${elementName}`, expectedText)
    }
  } catch (error) {
    throw new Error(error)
  }
})
