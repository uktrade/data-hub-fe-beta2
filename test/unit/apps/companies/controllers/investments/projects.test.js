const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')

const investmentsMock = require('test/unit/data/investment/collection.json')
const companyMock = require('test/unit/data/companies/minimal-company.json')

describe('Company investments project controlle', () => {
  beforeEach(() => {
    this.getCompanyInvestmentProjectsStub = sinon.stub()
    this.transformInvestmentProjectToListItemSpy = sinon.spy()
    this.transformApiResponseToCollectionSpy = sinon.spy()

    this.controller = proxyquire('src/apps/companies/apps/investments/projects/controllers/list', {
      '../../../../../investments/repos': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjectsStub,
      },
      '../../../../../investments/transformers': {
        transformInvestmentProjectToListItem: this.transformInvestmentProjectToListItemSpy,
      },
      '../../../../../../modules/api/transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionSpy,
      },
    })
  })

  describe('#renderInvestments', () => {
    context('when investments returns successfully', () => {
      beforeEach(async () => {
        this.getCompanyInvestmentProjectsStub.resolves(investmentsMock.results)

        this.middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            page: 1,
          },
          company: companyMock,
        })

        await this.controller(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call audit log with correct arguments', () => {
        expect(this.getCompanyInvestmentProjectsStub).to.have.been.calledWith('1234', companyMock.id, 1)
      })

      it('should call list item transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal('companies/apps/investments/projects/views/list')
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should send the correct template data', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1]).to.deep.equal({
          results: investmentsMock.results,
          actionButtons: [{
            label: 'Add investment project',
            url: `/investments/projects/create/${companyMock.id}`,
          }],
        })
      })
    })

    context('when investments rejects', () => {
      beforeEach(async () => {
        this.errorMock = {
          errorCode: 500,
        }

        this.getCompanyInvestmentProjectsStub.rejects(this.errorMock)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controller(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.errorMock)
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
