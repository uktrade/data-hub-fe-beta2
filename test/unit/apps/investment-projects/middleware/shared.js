const { merge, cloneDeep } = require('lodash')

const investmentData = require('~/test/unit/data/investment/investment-data.json')
const investmentProjectStages = require('~/test/unit/data/investment/investment-project-stages.json')

const companyData = {
  id: '6c388e5b-a098-e211-a939-e4115bead28a',
  name: 'Investor Company ltd.',
}

const adviserData = {
  id: '1234',
  first_name: 'Fred',
  last_name: 'Smith',
  dit_team: {
    id: '4444',
    name: 'Freds Team',
  },
}

const getInvestmentData = (ukCompanyId, clientRelationshipManagerId) => {
  return merge({}, investmentData, {
    uk_company: {
      id: ukCompanyId,
    },
    client_relationship_manager: {
      id: clientRelationshipManagerId,
    },
  })
}

const createMiddleware = (investmentData, adviserData, companyData, stages = investmentProjectStages) => {
  return proxyquire('~/src/apps/investment-projects/middleware/shared', {
    '../repos': {
      getInvestment: sinon.stub().resolves(investmentData),
    },
    '../../adviser/repos': {
      getAdviser: sinon.stub().resolves(adviserData),
    },
    '../../companies/repos': {
      getDitCompany: sinon.stub().resolves(companyData),
    },
    '../../../lib/metadata': {
      investmentProjectStage: stages,
    },
  })
}

describe('Investment shared middleware', () => {
  describe('#getInvestmentDetails', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {
          token: 'abcd',
        },
        params: {
          investmentId: investmentData.id,
        },
      }

      this.resMock = {
        breadcrumb: sinon.stub().returnsThis(),
        locals: {},
      }

      this.nextSpy = sinon.spy()
    })

    context('when all fields are populated', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(2, 3), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: adviserData,
          investor_company: {
            name: companyData.name,
          },
          uk_company: companyData,
        })

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should set investment data uk company on locals', () => {
        expect(this.resMock.locals.investmentData.uk_company).to.deep.equal(companyData)
      })
      it('should set investment data client relationship manager on locals', () => {
        expect(this.resMock.locals.investmentData.client_relationship_manager).to.deep.equal(adviserData)
      })
      it('should set equity company on locals', () => {
        const expectedEquityCompany = merge({}, investmentData.investor_company, {
          name: companyData.name,
        })

        expect(this.resMock.locals.equityCompany).to.deep.equal(expectedEquityCompany)
      })
      it('should set investment project stages on locals', () => {
        expect(this.resMock.locals.investmentProjectStages).to.deep.equal([
          'Prospect',
          'Assign PM',
          'Active',
          'Verify win',
          'Won',
        ])
      })
      it('should set investment status on locals', () => {
        const expectedInvestmentStatus = {
          company: {
            name: 'Investor Company ltd.',
            url: '/companies/6c388e5b-a098-e211-a939-e4115bead28a',
          },
          currentStage: {
            incompleteFields: [],
            isComplete: false,
            messages: [],
            name: 'Prospect',
          },
          id: 'f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7',
          meta: [
            {
              label: 'Status',
              url: '/investment-projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7/status',
              urlLabel: 'change',
              value: '',
            },
            {
              label: 'Project code',
              value: 'DHP-00000003',
            },
            {
              label: 'Valuation',
              value: 'Not yet valued',
            },
            {
              label: 'Created on',
              value: '1 Jan 1970, 12:00am',
            },
          ],
          nextStage: {
            name: 'Assign PM',
            disabled_on: null,
            exclude_from_investment_flow: false,
            id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
          },
        }

        expect(this.resMock.locals.investmentStatus).to.deep.equal(expectedInvestmentStatus)
      })
      it('should set the breadcrumb', () => {

      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when uk company is not provided', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(null, 3), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: adviserData,
          investor_company: {
            name: companyData.name,
          },
          uk_company: {
            id: null,
          },
        })

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data uk company on locals', () => {
        expect(this.resMock.locals.investmentData.uk_company.id).to.be.null
      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when client relationship manager is not provided', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(2, null), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: {
            id: null,
          },
          investor_company: {
            name: companyData.name,
          },
          uk_company: companyData,
        })

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data client relationship manager on locals', () => {
        expect(this.resMock.locals.investmentData.client_relationship_manager.id).to.be.null
      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.error = new Error('error')

        const middleware = proxyquire('~/src/apps/investment-projects/middleware/shared', {
          '../repos': {
            getInvestment: sinon.stub().throws(this.error),
          },
          '../../adviser/repos': {
            getAdviser: sinon.stub().throws(this.error),
          },
          '../../companies/repos': {
            getDitCompany: sinon.stub().throws(this.error),
          },
        })

        middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next with error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })

    context('when the streamlined-investment-flow feature flag is set to true', () => {
      beforeEach(async () => {
        const stages = cloneDeep(investmentProjectStages)

        // Exclude the Assign PM stage.
        stages[1].exclude_from_investment_flow = true

        this.resMock = {
          breadcrumb: sinon.stub().returnsThis(),
          locals: {
            features: {
              'streamlined-investment-flow': true,
            },
          },
        }
        const middleware = createMiddleware(getInvestmentData(2, null), adviserData, companyData, stages)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })
      it('should remove the Assign PM stage from the investmentProjectStages array on locals', () => {
        expect(this.resMock.locals.investmentProjectStages).to.deep.equal([
          'Prospect',
          'Active',
          'Verify win',
          'Won',
        ])
      })
    })
  })
})
