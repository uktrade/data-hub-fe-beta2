const companyData = require('~/test/unit/data/company.json')
const orderData = require('~/test/unit/data/omis/simple-order.json')
const subscriberData = require('~/test/unit/data/omis/subscribers.json')
const assigneeData = require('~/test/unit/data/omis/assignees.json')

describe('OMIS middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.setHomeBreadcrumbReturnSpy = this.sandbox.spy()
    this.setHomeBreadcrumbStub = this.sandbox.stub().returns(this.setHomeBreadcrumbReturnSpy)
    this.getDitCompanyStub = this.sandbox.stub()
    this.getByIdStub = this.sandbox.stub()
    this.getSubscribersStub = this.sandbox.stub()
    this.getAssigneesStub = this.sandbox.stub()
    this.loggerSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()

    this.resMock = {
      locals: {},
    }
    this.reqMock = {
      session: {
        token: 'session-12345',
      },
    }

    this.middleware = proxyquire('~/src/apps/omis/middleware', {
      '../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../../../config/logger': {
        error: this.loggerSpy,
      },
      '../middleware': {
        setHomeBreadcrumb: this.setHomeBreadcrumbStub,
      },
      './models': {
        Order: {
          getById: this.getByIdStub,
          getSubscribers: this.getSubscribersStub,
          getAssignees: this.getAssigneesStub,
        },
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getCompany()', () => {
    beforeEach(() => {
      this.companyId = 'c-1234567890'
    })

    context('when get company resolves', () => {
      beforeEach(() => {
        this.getDitCompanyStub.resolves(companyData)
      })

      it('should call getDitCompany() with correct arguments', async () => {
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.getDitCompanyStub).to.have.been.calledWith(this.reqMock.session.token, this.companyId)
      })

      it('should set a company property on locals', async () => {
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.resMock.locals).to.have.property('company')
        expect(this.resMock.locals.company).to.deep.equal(companyData)
      })

      it('should call next with no errors', async () => {
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when a company rejects', () => {
      beforeEach(() => {
        this.error = {
          statusCode: 404,
        }
        this.getDitCompanyStub.rejects(this.error)
      })

      it('should call next with an error', async () => {
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })

      it('should not set a company property on locals', async () => {
        await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.resMock.locals).to.not.have.property('company')
      })
    })
  })

  describe('getOrder()', () => {
    beforeEach(() => {
      this.orderId = 'o-1234567890'
    })

    context('when model methods resolve', () => {
      beforeEach(() => {
        this.getByIdStub.resolves(orderData)
        this.getSubscribersStub.resolves(subscriberData)
        this.getAssigneesStub.resolves(assigneeData)
      })

      it('should call model methods with correct arguments', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.getByIdStub).to.have.been.calledWith(this.reqMock.session.token, this.orderId)
        expect(this.getSubscribersStub).to.have.been.calledWith(this.reqMock.session.token, this.orderId)
        expect(this.getAssigneesStub).to.have.been.calledWith(this.reqMock.session.token, this.orderId)
      })

      it('should set a order property on locals', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        const order = Object.assign({}, orderData, {
          subscribers: subscriberData,
          assignees: assigneeData,
          isEditable: true,
        })
        expect(this.resMock.locals).to.have.property('order')
        expect(this.resMock.locals.order).to.deep.equal(order)
      })

      it('should call next with no errors', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.nextSpy).to.have.been.calledWith()
      })

      context('when order is in draft', () => {
        beforeEach(() => {
          const draftOrder = Object.assign({}, orderData, {
            status: 'draft',
          })
          this.getByIdStub.resolves(draftOrder)
        })

        it('should set isEditable to true', async () => {
          await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

          expect(this.resMock.locals.order.isEditable).to.equal(true)
        })
      })

      context('when order is not in draft', () => {
        beforeEach(() => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'quote_awaiting_acceptance',
          })
          this.getByIdStub.resolves(quoteOrder)
        })

        it('should set isEditable to false', async () => {
          await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

          expect(this.resMock.locals.order.isEditable).to.equal(false)
        })
      })
    })

    context('when a model method rejects', () => {
      beforeEach(() => {
        this.error = {
          statusCode: 404,
        }
        this.getByIdStub.rejects(this.error)
      })

      it('should not set an order property on locals', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.resMock.locals).to.not.have.property('order')
      })

      it('should log the error', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.loggerSpy).to.have.been.calledWith(this.error)
      })

      it('should call next without an error', async () => {
        await this.middleware.getOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setOrderBreadcrumb()', () => {
    beforeEach(() => {
      this.resMock.locals.order = {
        id: '123456789',
        reference: '12345/AS',
      }
    })

    it('should call setHomeBreadcrumb with order reference', () => {
      this.middleware.setOrderBreadcrumb({}, this.resMock, this.nextSpy)

      expect(this.setHomeBreadcrumbStub).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbStub).to.have.been.calledWith('12345/AS')

      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledWith({}, this.resMock, this.nextSpy)
    })
  })
})
