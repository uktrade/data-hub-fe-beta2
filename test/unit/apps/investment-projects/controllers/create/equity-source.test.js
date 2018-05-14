const token = 'abcd'
const ukCompany = {
  id: '12345',
  name: 'Test company',
  uk_based: true,
}
const foreignCompany = {
  id: '12345',
  name: 'Test company',
  uk_based: false,
}
const investmentProjects = {
  count: 0,
  results: [],
}
const searchResults = {
  items: [],
  count: 0,
}

describe('Investment start controller', () => {
  beforeEach(() => {
    this.next = sinon.stub()
    this.getCompanyInvestmentProjects = sinon.stub().resolves(investmentProjects)
    this.searchForeignCompanies = sinon.stub().resolves(searchResults)
    this.buildPagination = sinon.stub().returns(null)
    this.breadcrumbStub = sinon.stub().returnsThis()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/create/equity-source', {
      '../../repos': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjects,
      },
      '../../../search/services': {
        searchForeignCompanies: this.searchForeignCompanies,
      },
      '../../../../lib/pagination': {
        buildPagination: this.buildPagination,
      },
    })
  })

  describe('#getHandler', () => {
    describe('when no company ID is present', () => {
      it('should render company details and search', (done) => {
        this.resMock = {
          locals: {},
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.getHandler({
          session: {
            token,
          },
          query: {},
        }, this.resMock, () => {
          expect(this.resMock.locals.company).to.be.undefined
          expect(this.resMock.locals.company).to.be.undefined
          expect(this.resMock.locals.showSearch).to.equal(false)
          done()
        })
      })
    })

    describe('when a UK client company exists', () => {
      it('should render company details and search', (done) => {
        this.resMock = {
          locals: {
            company: ukCompany,
          },
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.getHandler({
          session: {
            token,
          },
          query: {},
        }, this.resMock, () => {
          expect(this.getCompanyInvestmentProjects).to.be.calledWith(token, '12345')
          expect(this.resMock.locals.company).to.deep.equal(ukCompany)
          expect(this.resMock.locals.companyInvestments).to.deep.equal(investmentProjects)
          expect(this.resMock.locals.showSearch).to.equal(true)
          done()
        })
      })
    })

    describe('when a foreign client company exists', () => {
      it('should render company details and no search', (done) => {
        this.resMock = {
          locals: {
            company: foreignCompany,
          },
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.getHandler({
          session: {
            token,
          },
          query: {},
        }, this.resMock, () => {
          expect(this.getCompanyInvestmentProjects).to.be.calledWith(token, '12345')
          expect(this.resMock.locals.company).to.deep.equal(foreignCompany)
          expect(this.resMock.locals.companyInvestments).to.deep.equal(investmentProjects)
          expect(this.resMock.locals.showSearch).to.equal(false)
          done()
        })
      })

      it('should render search', (done) => {
        this.resMock = {
          locals: {
            company: '12345',
          },
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.getHandler({
          session: {
            token,
          },
          query: {
            'search': true,
          },
        }, this.resMock, () => {
          expect(this.resMock.locals.showSearch).to.equal(true)
          done()
        })
      })
    })

    describe('when query contains a search term', () => {
      it('should render results', async () => {
        this.reqMock = {
          session: {
            token,
          },
          query: {
            'term': 'samsung',
          },
        }
        this.resMock = {
          locals: {
            company: '12345',
          },
          breadcrumb: this.breadcrumbStub,
        }

        const expected = {
          aggregations: undefined,
          count: 0,
          highlightTerm: undefined,
          items: [],
          pagination: null,
        }

        await this.controller.getHandler(this.reqMock, this.resMock, this.next)

        expect(this.resMock.locals.searchTerm).to.equal('samsung')
        expect(this.resMock.locals.searchResult).to.deep.equal(expected)
        expect(this.resMock.locals.searchResult.pagination).to.be.null
      })
    })
  })

  describe('#postHandler', () => {
    describe('when client company is the equity source', () => {
      it('should redirect to the create step', (done) => {
        this.controller.postHandler({
          body: {
            'company_id': '12345',
            'is_equity_source': 'true',
          },
        }, {
          redirect: (path) => {
            expect(path).to.equal('/investment-projects/create/project/12345')
            done()
          },
        }, this.next)
      })
    })

    describe('when client company is not the equity source', () => {
      it('should redirect to the start step with search param', (done) => {
        this.controller.postHandler({
          body: {
            'company_id': '12345',
            'is_equity_source': 'false',
          },
        }, {
          redirect: (path) => {
            expect(path).to.equal('/investment-projects/create/equity-source/12345?search=true')
            done()
          },
        }, this.next)
      })
    })

    describe('when no value is given for equity source', () => {
      it('should show errors', (done) => {
        this.resMock = {
          locals: {},
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.postHandler({
          session: {
            token,
          },
          body: {
            'company_id': '12345',
          },
        }, this.resMock, () => {
          expect(this.resMock.locals.form.errors.messages).to.have.property('is_equity_source')
          done()
        })
      })
    })
  })
})
