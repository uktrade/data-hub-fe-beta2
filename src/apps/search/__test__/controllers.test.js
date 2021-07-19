const config = require('../../../config')
const { renderSearchResults } = require('../controllers')

describe('Search Controller #renderSearchResults', () => {
  const investmentResponse = require('../../../../test/unit/data/search/investment.json')
  const contactResponse = require('../../../../test/unit/data/search/contact.json')
  const companyResponse = require('../../../../test/unit/data/search/company.json')
  const eventResponse = require('../../../../test/unit/data/search/event.json')

  const searchQuery = {
    term: 'london',
    limit: 10,
    offset: 0,
  }

  beforeEach(async () => {
    this.next = sinon.spy()
    this.renderFunction = sinon.spy()
    this.breadcrumbStub = sinon.stub().returnsThis()

    this.req = {
      session: { token: 'abcd' },
      query: {
        term: searchQuery.term,
      },
      params: {},
    }

    this.res = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderFunction,
      locals: {
        features: {
          'address-area-company-search': true,
        },
      },
    }
  })

  context('for invalid paths', () => {
    it('should redirect to index', async () => {
      this.req.params.searchPath = 'dummy-path'

      await renderSearchResults(this.req, this.res, this.next)

      expect(this.renderFunction).to.be.calledWith('search/view')
    })
  })

  context('for investment projects', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/search`)
        .query(Object.assign({}, searchQuery, { entity: 'investment_project' }))
        .reply(200, investmentResponse)
      this.req.params.searchPath = 'investment-projects'
      this.searchResults = await renderSearchResults(
        this.req,
        this.res,
        this.next
      )
    })

    it('should call render with investment projects data', async () => {
      expect(this.renderFunction).to.be.calledWith(
        sinon.match.any,
        sinon.match({
          searchEntity: 'investment_project',
          searchTerm: 'london',
          results: sinon.match.object,
        })
      )
    })
  })

  context('for contacts', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get(`/v3/search`)
        .query(Object.assign({}, searchQuery, { entity: 'contact' }))
        .reply(200, contactResponse)
    })

    it('should call render with contacts data', async () => {
      this.req.params.searchPath = 'contacts'
      await renderSearchResults(this.req, this.res, this.next)

      expect(this.renderFunction).to.be.calledWith(
        'search/view',
        sinon.match({
          searchEntity: 'contact',
          searchTerm: 'london',
          results: sinon.match.object,
        })
      )
    })
  })

  context('for companies', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get(`/v3/search`)
        .query(Object.assign({}, searchQuery, { entity: 'company' }))
        .reply(200, companyResponse)
    })

    it('should call render with companies data', async () => {
      this.req.params.searchPath = 'companies'
      await renderSearchResults(this.req, this.res, this.next)

      expect(this.renderFunction).to.be.calledWith(
        'search/view',
        sinon.match({
          searchEntity: 'company',
          searchTerm: 'london',
          results: sinon.match.object,
        })
      )
    })

    it('should transform companies data', async () => {
      this.req.params.searchPath = 'companies'
      await renderSearchResults(this.req, this.res, this.next)

      const actualItems = this.renderFunction.getCall(0).args[1].results.items

      expect(actualItems[0].type).to.equal('company')
    })
  })

  context('investment projects', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get(`/v3/search`)
        .query(Object.assign({}, searchQuery, { entity: 'event' }))
        .reply(200, eventResponse)
    })

    it('should call render with events data', async () => {
      this.req.params.searchPath = 'events'
      await renderSearchResults(this.req, this.res, this.next)

      expect(this.renderFunction).to.be.calledWith(
        'search/view',
        sinon.match({
          searchEntity: 'event',
          searchTerm: 'london',
          results: sinon.match.object,
        })
      )
    })

    it('should transform events data', async () => {
      this.req.params.searchPath = 'events'
      await renderSearchResults(this.req, this.res, this.next)

      const actualItems = this.renderFunction.getCall(0).args[1].results.items

      expect(actualItems[0].type).to.equal('event')
    })
  })
})
