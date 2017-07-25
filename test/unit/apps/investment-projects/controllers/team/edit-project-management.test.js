const investmentData = require('~/test/unit/data/investment/investment-data.json')
const { briefInvestmentSummaryLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment project, project management team, edit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.flashStub = this.sandbox.stub()
    this.getDataLabelsStub = this.sandbox.stub()
    this.resMock = {
      breadcrumb: {
        add: () => this.resMock,
        update: () => this.resMock,
        get: () => [],
      },
    }

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/team/edit-project-management', {
      '../../../../lib/controller-utils': {
        getDataLabels: this.getDataLabelsStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getHandler', () => {
    it('should render edit project management view', (done) => {
      this.controller.getHandler({
        session: {
          token: 'abcd',
        },
      }, Object.assign(this.resMock, {
        locals: {
          investmentData,
        },
        render: (template) => {
          try {
            expect(template).to.equal('investment-projects/views/team/edit-project-management')
            done()
          } catch (e) {
            done(e)
          }
        },
      }), this.nextStub)
    })

    it('should get formatted data for summary view', (done) => {
      const briefInvestmentSummaryData = {
        id: 1,
      }

      this.controller.getHandler({
        session: {
          token: 'abcd',
        },
      }, Object.assign(this.resMock, {
        locals: {
          investmentData,
          briefInvestmentSummaryData,
        },
        render: (template) => {
          try {
            expect(this.getDataLabelsStub).to.be.calledWith(briefInvestmentSummaryData, briefInvestmentSummaryLabels.view)
            done()
          } catch (e) {
            done(e)
          }
        },
      }), this.nextStub)
    })
  })

  describe('#postHandler', () => {
    describe('without errors', () => {
      it('should redirect to the product team details page', (done) => {
        this.controller.postHandler({
          session: {
            token: 'abcd',
          },
          flash: this.flashStub,
        }, Object.assign(this.resMock, {
          locals: {
            form: {
              errors: {},
            },
            investmentData,
          },
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investment-projects/${investmentData.id}/team`)
              expect(this.flashStub).to.calledWith('success', 'Updated investment details')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.nextStub)
      })
    })

    describe('when form errors exist', () => {
      it('should pass the error onto the edit form', () => {
        this.controller.postHandler({
          session: {
            token: 'abcd',
          },
        }, Object.assign(this.resMock, {
          locals: {
            form: {
              errors: {
                subject: 'example error',
              },
            },
          },
        }), this.nextStub)

        expect(this.nextStub).to.be.calledOnce
      })
    })
  })
})
