const paths = require('~/src/apps/investment-projects/paths')

const mockInvestmentDetails = {
  'investment_type': '1',
  'fdi_type': '2',
}

describe('Investment create controller', () => {
  beforeEach(() => {
    this.next = sinon.stub()
    this.breadcrumbStub = () => {
      return this
    }

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/create/project', {
      '../../../../lib/metadata': {
        investmentTypeOptions: [
          { id: '1', name: 'Example investment type #1' },
          { id: '2', name: 'Example investment type #2' },
        ],
        fdiOptions: [
          { id: '1', name: 'FDI options #1' },
          { id: '2', name: 'FDI options #2' },
        ],
      },
    })
  })

  describe('#createGetHandler', () => {
    describe('when no company ID is provided', () => {
      it('should redirect to the start', (done) => {
        this.controller.getHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            paths,
          },
          breadcrumb: this.breadcrumbStub,
          redirect: (url) => {
            try {
              expect(url).to.equal('/investments/projects/create')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when a the company exists', () => {
      it('should render create investment view', (done) => {
        const expectedInvestmentDetails = {
          investment_type: { value: '1', label: 'Example investment type #1' },
          fdi_type: { value: '2', label: 'FDI options #2' },
        }

        this.resMock = {
          locals: {
            equityCompany: {
              id: '12345',
            },
          },
          breadcrumb: this.breadcrumbStub,
        }

        this.controller.getHandler({
          store: {
            get: () => {
              return mockInvestmentDetails
            },
          },
          session: {
            token: 'abcd',
          },
        }, this.resMock, () => {
          expect(this.resMock.locals.form.options.investmentDetails).to.deep.equal(expectedInvestmentDetails)
          done()
        })
      })
    })
  })

  describe('#createPostHandler', () => {
    describe('when resultId is set', () => {
      it('should redirect to the investment project', (done) => {
        this.controller.postHandler({
          flash: () => {},
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            resultId: '12345',
            form: {},
            paths,
          },
          breadcrumb: this.breadcrumbStub,
          redirect: (url) => {
            try {
              expect(url).to.equal('/investments/projects/12345/details')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when form errors exist', () => {
      it('should call next middleware to render create investment form', (done) => {
        this.controller.postHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            form: {
              errors: {},
            },
          },
          breadcrumb: this.breadcrumbStub,
        }, () => {
          done()
        })
      })
    })
  })
})
