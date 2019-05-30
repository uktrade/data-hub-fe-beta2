const moment = require('moment')

const config = require('~/config')
const yesterday = moment()
  .subtract(1, 'days')
  .toISOString()
const lastWeek = moment()
  .subtract(1, 'weeks')
  .toISOString()
const today = moment().toISOString()

const { getOptions, fetchOptions } = require('~/src/lib/options')

const regionOptions = [
  { id: '1', name: 'r1', disabled_on: null },
  { id: '3', name: 'r3', disabled_on: null },
  { id: '2', name: 'r2', disabled_on: yesterday },
]

const serviceOptions = [
  {
    id: '1',
    name: 'Advice',
    disabled_on: null,
    contexts: [
      'service_delivery',
      'investment_project_interaction',
      'interaction',
      'event',
    ],
  },
  {
    id: '2',
    name: 'Sales',
    disabled_on: '2017-06-27T13:43:29.000001Z',
    contexts: [
      'service_delivery',
      'investment_project_interaction',
      'interaction',
      'event',
    ],
  },
]

describe('#options', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .get('/metadata/uk-region/')
      .reply(200, regionOptions)

    nock(config.apiRoot)
      .get('/metadata/123/&contexts__has_any=')
      .reply(200, regionOptions)
  })

  context('when asking for options for a new record', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region')
      this.fetchedOptions = await fetchOptions(
        '1234',
        `${config.apiRoot}/metadata/123/&contexts__has_any=`
      )
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r3', value: '3' },
      ])
    })

    it('fetches options', async () => {
      expect(this.fetchedOptions).to.deep.equal(regionOptions)
    })
  })

  context('when asking for options for an existing record using disabled value', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', {
        currentValue: '2',
        createdOn: today,
      })
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
      this.options = await getOptions('1234', 'uk-region', {
        currentValue: '1',
        createdOn: lastWeek,
      })
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
      this.options = await getOptions('1234', 'uk-region', {
        includeDisabled: true,
      })
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
      this.options = await getOptions('1234', 'uk-region', {
        includeDisabled: true,
        sorted: false,
      })
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
      this.options = await getOptions('1234', 'uk-region', {
        term: 'r1',
        includeDisabled: true,
      })
    })

    it('should only return the option that starts with the term', () => {
      expect(this.options).to.deep.equal([{ label: 'r1', value: '1' }])
    })
  })

  context('when a context is provided', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/metadata/service/?contexts__has_any=interaction')
        .reply(200, serviceOptions)
    })

    context('when there is a context in the options response', () => {
      beforeEach(async () => {
        this.options = await getOptions('1234', 'service', {
          context: 'interaction',
        })
      })

      it('should return options in that context', () => {
        expect(this.options).to.deep.equal([{ label: 'Advice', value: '1' }])
      })
    })
  })

  context('when a transformer is provided', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', {
        includeDisabled: true,
        transformer: ({ id, name }) => {
          return {
            value: id,
            text: name,
          }
        },
      })
    })

    it('should transform the options', () => {
      expect(this.options).to.deep.equal([
        { text: 'r1', value: '1' },
        { text: 'r3', value: '3' },
        { text: 'r2', value: '2' },
      ])
    })
  })

  context('when the options are sorted', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', {
        sorted: true,
        sortPropertyName: 'text',
        includeDisabled: true,
        transformer: ({ id, name }) => {
          return {
            value: id,
            text: name,
          }
        },
      })
    })

    it('should sort the options by the property name "text"', () => {
      expect(this.options).to.deep.equal([
        { text: 'r1', value: '1' },
        { text: 'r2', value: '2' },
        { text: 'r3', value: '3' },
      ])
    })
  })
})
