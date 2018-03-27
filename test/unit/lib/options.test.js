const moment = require('moment')

const config = require('~/config')
const yesterday = moment().subtract(1, 'days').toISOString()
const lastWeek = moment().subtract(1, 'weeks').toISOString()
const today = moment().toISOString()

const { getOptions } = require('~/src/lib/options')

const regionOptions = [
  { id: '1', name: 'r1', disabled_on: null },
  { id: '3', name: 'r3', disabled_on: null },
  { id: '2', name: 'r2', disabled_on: yesterday },
]

describe('#options', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .get('/metadata/uk-region/')
      .reply(200, regionOptions)
  })

  context('when asking for options for a new record', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region')
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for options for an existing record using disabled value', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { currentValue: '2', createdOn: today })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for options for an existing record created before option disabled', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { currentValue: '1', createdOn: lastWeek })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for all options for a filter form', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { includeDisabled: true })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when the options are to not be sorted', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { includeDisabled: true, sorted: false })
    })

    it('should not sort the options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r3', value: '3' },
        { label: 'r2', value: '2' },
      ])
    })
  })

  context('when a search term is provided', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { term: 'r1', includeDisabled: true })
    })

    it('should only return the option that starts with the term', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
      ])
    })
  })
})
