const assert = require('assert')

const hideScrollBarIE = () => {
  if (browser.capabilities.browserName == 'internet explorer') {
    return browser.execute(function () {
      document.body.style.msOverflowStyle = 'none'
    })
  }
}

describe('Data Hub', () => {
  describe('home page', () => {
    before(async () => {
      await browser.url('')
      await hideScrollBarIE()
    })

    it('content', async () => {
      // Wait for the initial list to be loaded
      await $('=Edit list name')
      await browser.imageDiff.hideElement('.dashboard-section__info-feed-date')
      await browser.imageDiff.takeElement('.grid-row')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })

    it('header', async () => {
      await browser.imageDiff.takeElement('.datahub-header')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })

    it('search bar', async () => {
      await browser.imageDiff.takeElement('.govuk-grid-column-full')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })
  })

  it('contacts page', async () => {
    await browser.url('/contacts')
    await $('[data-test="metadata"]')
    await hideScrollBarIE()
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('companies page', async () => {
    await browser.url('/companies')
    await hideScrollBarIE()
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('interactions page', async () => {
    await browser.url('/interactions')
    await hideScrollBarIE()
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('investments page', async () => {
    await browser.url('/investments/projects')
    await hideScrollBarIE()
    const filter = await $('#field-stage')
    await filter.waitForDisplayed({ timeout: 10000 })
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('omis page', async () => {
    await browser.url('/omis')
    await hideScrollBarIE()
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('events page', async () => {
    await browser.url('/events')
    await hideScrollBarIE()
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })
})
