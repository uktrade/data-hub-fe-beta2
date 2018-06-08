const { pickBy } = require('lodash')

const config = require('~/config')
const companiesHouseSearchResults = require('~/test/unit/data/companies/companies-house-search.json')
const ghqCompanySearchResponse = require('~/test/unit/data/companies/ghq-company-search-response.json')
const ghqCompanyTransformedResults = require('~/test/unit/data/companies/ghq-company-transformed-results.json')
const subsidiaryCompanySearchResponse = require('~/test/unit/data/companies/subsidiary-company-search-response.json')
const subsidiaryCompanyTransformedResults = require('~/test/unit/data/companies/subsidiary-company-transformed-results.json')

const {
  getRequestBody,
  getCompanyCollection,
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('~/src/apps/companies/middleware/collection')

const headquarterTypes = [{
  id: '3e6debb4-1596-40c5-aa25-f00da0e05af9',
  name: 'ukhq',
  disabled_on: null,
}, {
  id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
  name: 'ehq',
  disabled_on: null,
}, {
  id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
  name: 'ghq',
  disabled_on: null,
}]

describe('Company collection middleware', () => {
  beforeEach(() => {
    this.mockCompanyResults = {
      count: 3,
      results: [
        { id: '111', name: 'A' },
        { id: '222', name: 'B' },
        { id: '333', name: 'C' },
      ],
    }
    this.nextSpy = sinon.spy()
    this.reqMock = {
      ...globalReq,
      session: { token: 'abcd' },
    }
    this.resMock = {
      locals: {},
    }
  })

  describe('#getCompanyCollection', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/company`)
        .reply(200, this.mockCompanyResults)

      this.reqMock.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await getCompanyCollection(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should set results property on locals with pagination', () => {
      const actual = this.resMock.locals.results
      expect(actual).to.have.property('count')
      expect(actual).to.have.property('items').to.have.length(3)
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })

  describe('#getRequestBody', () => {
    it('should not set req.body for empty query', () => {
      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.be.an('object').and.empty
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', () => {
      this.reqMock.query = {
        sector_descends: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
        random: 'query',
      }

      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.deep.equal({
        sector_descends: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
      })
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.reqMock.query = {
        random: 'query',
        some: 'more',
      }

      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.be.an('object').and.empty
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })

  describe('#getLimitedCompaniesCollection', () => {
    context('when search returns results', () => {
      beforeEach(async () => {
        this.searchStub = sinon.stub().resolves(companiesHouseSearchResults)
        this.transformerStub = sinon.stub().returns({
          id: '1234',
          name: 'Freds',
          meta: [],
        })

        const collectionMiddleware = proxyquire('~/src/apps/companies/middleware/collection', {
          '../../search/services': {
            searchLimitedCompanies: this.searchStub,
          },
          '../transformers': {
            transformCompaniesHouseToListItem: this.transformerStub,
          },
        })

        this.reqMock = Object.assign({}, this.reqMock, {
          query: {
            term: 'fred',
            page: '2',
          },
        })

        await collectionMiddleware.getLimitedCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should search for companies house results', () => {
        expect(this.searchStub).to.be.calledWith({
          token: 'abcd',
          searchTerm: 'fred',
          page: '2',
        })
      })

      it('should use the companies house transformer', () => {
        expect(this.transformerStub).to.be.called
      })

      it('should include results', () => {
        expect(this.resMock.locals).to.have.property('results')
      })

      it('should adjust the url in the search results to point to the add company screen', () => {
        expect(this.resMock.locals.results.items[0].url).to.equal('/companies/add/1234')
      })
    })
  })

  describe('#getGlobalHQCompaniesCollection', () => {
    beforeEach(async () => {
      this.resMock.locals.company = { id: 'mock-parent-company-id' }
    })

    context('no searchTerm', () => {
      beforeEach(async () => {
        this.reqMock.query = {}
        await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
      })

      it('results should be undefined', () => {
        expect(this.resMock.locals.results).to.be.undefined
      })
    })

    context('with searchTerm', () => {
      context('with 200 response', () => {
        beforeEach(async () => {
          this.reqMock.query.term = 'mock-search-term'

          nock(config.apiRoot)
            .get('/metadata/headquarter-type/')
            .reply(200, headquarterTypes)
            .post('/v3/search/company?offset=0&limit=10')
            .reply(200, ghqCompanySearchResponse)

          await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('results should be as expected', () => {
          expect(pickBy(this.resMock.locals.results)).to.deep.equal(ghqCompanyTransformedResults)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })

      context('with error response', () => {
        beforeEach(async () => {
          this.reqMock.query.term = 'mock-search-term'
          this.errorMsg = 'oh no!'

          nock(config.apiRoot)
            .get('/metadata/headquarter-type/')
            .reply(200, headquarterTypes)
            .post('/v3/search/company?offset=0&limit=10')
            .replyWithError(this.errorMsg)

          await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.args[0][0].message).to.have.string(`Error: ${this.errorMsg}`)
        })

        it('results should be undefined', () => {
          expect(this.resMock.locals.results).to.be.undefined
        })
      })
    })
  })

  describe('#getSubsidiaryCompaniesCollection', () => {
    beforeEach(async () => {
      this.resMock.locals.company = { id: 'mock-parent-company-id' }
    })

    context('no searchTerm', () => {
      beforeEach(async () => {
        this.reqMock.query = {}
        await getSubsidiaryCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy).to.be.calledWithExactly()
      })

      it('results should be undefined', () => {
        expect(this.resMock.locals.results).to.be.undefined
      })
    })

    context('with searchTerm', () => {
      beforeEach(() => {
        this.reqMock.query.term = 'mock-search-term'
      })

      context('a couple of results', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get('/metadata/headquarter-type/')
            .reply(200, headquarterTypes)
            .post('/v3/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(200, subsidiaryCompanySearchResponse)

          await getSubsidiaryCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should return results', () => {
          expect(this.resMock.locals).to.have.property('results')
        })

        it('should include a count of results', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('count', 2)
        })

        it('should not include any pagination information', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('pagination', null)
        })

        it('should include transformed result items', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('items')
          expect(results.items).to.deep.equal(subsidiaryCompanyTransformedResults.items)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.be.calledOnce
          expect(this.nextSpy).to.be.calledWithExactly()
        })
      })

      context('more than 10 results', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get('/metadata/headquarter-type/')
            .reply(200, headquarterTypes)
            .post('/v3/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(200, {
              ...subsidiaryCompanySearchResponse,
              count: 50,
            })

          await getSubsidiaryCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should include pagination information', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('pagination')
          expect(results.pagination).to.have.property('currentPage', 1)
          expect(results.pagination).to.have.property('prev')
          expect(results.pagination).to.have.property('next')
          expect(results.pagination.pages).to.have.length(5)
        })
      })

      context('with error response', () => {
        beforeEach(async () => {
          this.errorMsg = 'oh no!'

          nock(config.apiRoot)
            .get('/metadata/headquarter-type/')
            .reply(200, headquarterTypes)
            .post('/v3/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(500, this.errorMsg)

          await getSubsidiaryCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.firstCall.args[0].message).to.have.string(`500 - "${this.errorMsg}"`)
        })

        it('results should be undefined', () => {
          expect(this.resMock.locals.results).to.be.undefined
        })
      })
    })
  })
})
