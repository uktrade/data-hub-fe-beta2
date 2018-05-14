const ordersMock = require('~/test/unit/data/omis/collection.json')
const companyMock = require('~/test/unit/data/company.json')
const tokenMock = '12345abcde'

describe('Company investments controller', () => {
  beforeEach(() => {
    this.searchStub = sinon.stub()
    this.transformOrderToListItemSpy = sinon.spy()
    this.transformApiResponseToCollectionSpy = sinon.spy()
    this.breadcrumbStub = sinon.stub().returnsThis()
    this.renderSpy = sinon.spy()
    this.nextSpy = sinon.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/orders', {
      '../../search/services': {
        search: this.searchStub,
      },
      '../../omis/transformers': {
        transformOrderToListItem: this.transformOrderToListItemSpy,
      },
      '../../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionSpy,
      },
    })

    this.reqMock = {
      query: {},
      session: {
        token: tokenMock,
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  context('when investments returns successfully', () => {
    beforeEach(() => {
      this.searchStub.resolves(ordersMock.results)
    })

    context('with default page number', () => {
      beforeEach(async () => {
        await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call search with correct arguments', () => {
        expect(this.searchStub).to.have.been.calledWith({
          isAggregation: false,
          page: 1,
          requestBody: {
            company: companyMock.id,
          },
          searchEntity: 'order',
          token: tokenMock,
        })
      })

      it('should call list item transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/orders')
        expect(this.renderSpy).to.have.been.calledOnce
      })

      it('should send results to the template', () => {
        expect(this.renderSpy.args[0][1].results).to.deep.equal(ordersMock.results)
      })

      it('should send an add button to the template', () => {
        expect(this.renderSpy.args[0][1].actionButtons).to.deep.equal([{
          label: 'Add order',
          url: `/omis/create?company=dcdabbc9-1781-e411-8955-e4115bead28a&skip-company=true`,
        }])
      })
    })

    context('when a custom page number', () => {
      beforeEach(async () => {
        this.reqMock.query.page = 2

        await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call with custom page number', () => {
        expect(this.searchStub).to.have.been.calledWith({
          isAggregation: false,
          page: 2,
          requestBody: {
            company: companyMock.id,
          },
          searchEntity: 'order',
          token: tokenMock,
        })
      })
    })
  })

  context('when search rejects', () => {
    beforeEach(async () => {
      this.errorMock = {
        errorCode: 500,
      }
      this.searchStub.rejects(this.errorMock)

      await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call next with error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
