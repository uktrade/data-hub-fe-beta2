const { assign, set } = require('lodash')

const { renderDocuments } = require('~/src/apps/companies/controllers/documents')

describe('Companies documents controller', () => {
  const companyId = 'mock-id'
  const companyName = 'mock-name'

  beforeEach(() => {
    this.breadcrumbStub = sinon.stub().returnsThis()
    this.resMock = assign({}, globalRes, {
      breadcrumb: this.breadcrumbStub,
      render: sinon.spy(),
      locals: {
        company: {
          id: companyId,
          name: companyName,
        },
      },
    })
    this.reqMock = assign({}, globalReq)
    this.nextSpy = sinon.spy()
  })

  describe('#renderDocuments', () => {
    context('when documents path is an empty string', () => {
      beforeEach(() => {
        set(this.resMock, 'locals.company.archived_documents_url_path', '')
        renderDocuments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledTwice
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith(companyName, `/companies/${companyId}`)
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Documents')
      })

      it('should call render', () => {
        expect(this.resMock.render).to.be.calledOnce
      })

      it('should call render with', () => {
        expect(this.resMock.render).to.be.calledWith('companies/views/documents', { archivedDocumentPath: '' })
      })
    })

    context('when documents path contains a url', () => {
      const mockDocumentUrl = 'mock-document-url'
      beforeEach(() => {
        set(this.resMock, 'locals.company.archived_documents_url_path', mockDocumentUrl)
        renderDocuments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledTwice
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith(companyName, `/companies/${companyId}`)
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Documents')
      })

      it('should call render', () => {
        expect(this.resMock.render).to.be.calledOnce
      })

      it('should call render with', () => {
        expect(this.resMock.render).to.be.calledWith('companies/views/documents', {
          archivedDocumentPath: mockDocumentUrl,
        })
      })
    })
  })
})
