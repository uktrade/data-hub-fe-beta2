const config = require('../../../../config')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  handleDeleteCompanyList,
  renderDeleteCompanyListPage,
} = require('../delete')

const companyList = require('../../../../../test/unit/data/company-lists/list-with-multiple-items.json')

const companyListId = '2a8fb06f-2099-44d6-b404-e0fae0b9ea59'

describe('Delete company list controller', () => {
  let middlewareParameters

  beforeEach(() => {
    middlewareParameters = buildMiddlewareParameters({
      requestParams: {
        listId: companyListId,
      },
    })
  })

  describe('#renderDeleteCompanyListPage', () => {
    beforeEach(async () => {
      middlewareParameters.resMock.locals.companyList = companyList
    })

    context('when it renders successfully', () => {
      beforeEach(async () => {
        await renderDeleteCompanyListPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('renders the delete list page', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith(
          'company-lists/views/delete-list'
        )
        expect(middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('passes props to react-slot', () => {
        const actualProps =
          middlewareParameters.resMock.render.getCall(0).args[1].props
        expect(actualProps).to.be.deep.equal({
          companyList: companyList,
          returnUrl: '/',
        })
      })

      it('adds a breadcrumb', () => {
        expect(
          middlewareParameters.resMock.breadcrumb.firstCall
        ).to.be.calledWith('Delete list')
      })
    })

    context('when there is an error rendering', () => {
      beforeEach(async () => {
        middlewareParameters.resMock.render.throws()

        await renderDeleteCompanyListPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('forwards the error to the next middleware', () => {
        expect(middlewareParameters.nextSpy).to.be.called
        expect(middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(
          Error
        )
      })
    })
  })

  describe('#handleDeleteCompanyList', () => {
    context('when the deletion succeeds', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .delete(`/v4/company-list/${companyListId}`)
          .reply(201)

        await handleDeleteCompanyList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('sets a flash message', () => {
        expect(middlewareParameters.reqMock.flash).to.be.calledWith(
          'success',
          'List deleted'
        )
      })

      it('sends a response', () => {
        expect(middlewareParameters.resMock.send).to.be.calledWith()
      })
    })

    context('when the deletion fails', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .delete(`/v4/company-list/${companyListId}`)
          .reply(404)

        await handleDeleteCompanyList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('forwards the error to the next middleware', () => {
        expect(middlewareParameters.resMock.send).to.not.be.called
        expect(middlewareParameters.nextSpy).to.be.called
        expect(middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(
          Error
        )
      })
    })
  })
})
