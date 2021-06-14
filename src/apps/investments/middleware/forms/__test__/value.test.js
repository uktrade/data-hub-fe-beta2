const { gvaMessages } = require('../gross-value-added-message')
const adviserData = require('../../../../../../test/unit/data/investment/interaction/advisers.json')
const controller = require('../value')
const { investmentTypes } = require('../../../types')
const paths = require('../../../paths')
const config = require('../../../../../config')
const { endOfToday, endOfYesterday, subMonths } = require('date-fns')

const gvaMessage = gvaMessages.capitalExpenditureAndPrimarySectorRequired
const yesterday = endOfYesterday()
const lastMonth = subMonths(endOfToday(), 1)

const metadataMock = {
  salaryRangeOptions: [
    { id: '1', name: 'sr1', disabled_on: null },
    { id: '2', name: 'sr2', disabled_on: yesterday },
    { id: '3', name: 'sr3', disabled_on: null },
  ],
  fdiValueOptions: [
    { id: '1', name: 'f1', disabled_on: null },
    { id: '2', name: 'f2', disabled_on: yesterday },
    { id: '3', name: 'f3', disabled_on: null },
  ],
  likelihoodToLandOptions: [
    { id: '1', name: 'Low', disabled_on: null },
    { id: '2', name: 'Medium', disabled_on: null },
    { id: '3', name: 'High', disabled_on: null },
  ],
}

describe('Investment form middleware - investment value', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()

    this.reqMock = {
      session: {
        token: '1234',
      },
      params: {
        investmentId: '1234',
      },
      flash: sinon.stub(),
    }

    this.resMock = {
      locals: {
        paths,
      },
      redirect: sinon.stub(),
    }

    nock(config.apiRoot)
      .get(`/adviser/?limit=100000&offset=0`)
      .reply(200, adviserData)
      .get('/v4/metadata/salary-range')
      .reply(200, metadataMock.salaryRangeOptions)
      .get('/v4/metadata/fdi-value')
      .reply(200, metadataMock.fdiValueOptions)
      .get('/v4/metadata/likelihood-to-land')
      .reply(200, metadataMock.likelihoodToLandOptions)
  })

  describe('#populateForm', () => {
    context('when called for a new form', () => {
      beforeEach(async () => {
        this.resMock.locals.investment = {
          investment_type: {
            name: investmentTypes.FDI,
          },
        }
        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('create an empty state object', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          average_salary: undefined,
          investment_type: { name: 'FDI' },
          gross_value_added_message: gvaMessage,
        })
      })

      it('should include active salary range options', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr3', value: '3' },
        ]

        expect(
          this.resMock.locals.form.options.averageSalaryRange
        ).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(
          expectedOptions
        )
      })
    })

    context('when called for an investment created in the past', () => {
      beforeEach(async () => {
        this.resMock.locals.investment = {
          id: '1234',
          created_on: lastMonth,
          investment_type: { name: 'FDI' },
          gross_value_added_message: gvaMessage,
        }

        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('create state object with investment data', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          id: '1234',
          created_on: lastMonth,
          average_salary: undefined,
          investment_type: { name: 'FDI' },
          gross_value_added_message: gvaMessage,
        })
      })

      it('should include active salary range options last month', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr2', value: '2' },
          { label: 'sr3', value: '3' },
        ]

        expect(
          this.resMock.locals.form.options.averageSalaryRange
        ).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options last month', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f2', value: '2' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(
          expectedOptions
        )
      })
    })

    context('when called after a previous post failed', () => {
      beforeEach(async () => {
        this.resMock.locals = {
          investment: {
            id: '1234',
            created_on: lastMonth,
            name: 'original name',
            investment_type: { name: 'FDI' },
            gross_value_added_message: gvaMessage,
          },
          form: {
            errors: ['an error'],
            state: {
              name: 'modified name',
            },
          },
        }

        await controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should gather labels for a form', () => {
        expect(this.resMock.locals.form).to.have.property('labels')
      })

      it('should combine investment data with form data to produce state', () => {
        expect(this.resMock.locals.form.state).to.deep.equal({
          id: '1234',
          created_on: lastMonth,
          average_salary: undefined,
          name: 'modified name',
          investment_type: { name: 'FDI' },
          gross_value_added_message: gvaMessage,
        })
      })

      it('should pass through errors', () => {
        expect(this.resMock.locals.form.errors).to.deep.equal(['an error'])
      })

      it('should include active salary range options last month', () => {
        const expectedOptions = [
          { label: 'sr1', value: '1' },
          { label: 'sr2', value: '2' },
          { label: 'sr3', value: '3' },
        ]

        expect(
          this.resMock.locals.form.options.averageSalaryRange
        ).to.deep.equal(expectedOptions)
      })

      it('should include active fdi value options last month', () => {
        const expectedOptions = [
          { label: 'f1', value: '1' },
          { label: 'f2', value: '2' },
          { label: 'f3', value: '3' },
        ]

        expect(this.resMock.locals.form.options.fdiValue).to.deep.equal(
          expectedOptions
        )
      })
    })
  })
  describe('#handleFormPost', () => {
    beforeEach(() => {
      this.resMock.locals.form = {
        labels: {},
        state: {},
        options: {},
      }
    })
    context('when called with a complete form', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            client_cannot_provide_total_investment: 'false',
            total_investment: '10000',
            client_cannot_provide_foreign_investment: 'false',
            foreign_equity_investment: '5000',
            number_new_jobs: '10',
            average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
            number_safeguarded_jobs: '100',
            fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
            government_assistance: 'false',
            r_and_d_budget: 'false',
            non_fdi_r_and_d_budget: 'false',
            new_tech_to_uk: 'false',
            export_revenue: 'false',
          })
          .reply(200, {})

        this.reqMock.body = {
          client_cannot_provide_total_investment: 'false',
          total_investment: '10000',
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        }
        await controller.handleFormPost(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('redirects to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('sends a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment value updated'
        )
      })
    })
    context('when called with invalid input', () => {
      beforeEach(async () => {
        this.error = {
          total_investment: ['This field may not be null.'],
        }

        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            client_cannot_provide_total_investment: 'false',
            total_investment: null,
            client_cannot_provide_foreign_investment: 'false',
            foreign_equity_investment: '5000',
            number_new_jobs: '10',
            average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
            number_safeguarded_jobs: '100',
            fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
            government_assistance: 'false',
            r_and_d_budget: 'false',
            non_fdi_r_and_d_budget: 'false',
            new_tech_to_uk: 'false',
            export_revenue: 'false',
          })
          .reply(400, this.error)

        this.reqMock.body = {
          client_cannot_provide_total_investment: 'false',
          total_investment: '',
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        }
        await controller.handleFormPost(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('passes the request to the next middleware', () => {
        expect(this.nextSpy).to.be.called
      })

      it('copies the errors to the response object', () => {
        expect(this.resMock.locals.errors).to.deep.equal({
          messages: this.error,
        })
      })
    })
  })
})
