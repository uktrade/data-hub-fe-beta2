/* eslint-disable camelcase */
describe('Documents Upload repos', () => {
  beforeEach(async () => {
    this.authorisedRequestStub = sinon.stub().resolves()
    this.getDocumentUploadS3UrlStub = sinon.stub()

    this.repos = proxyquire('~/src/apps/documents/repos', {
      '../../lib/authorised-request': this.authorisedRequestStub,
      '/repos': {
        getDocumentUploadS3Url: this.getDocumentUploadS3UrlStub.onCall(0).returns({
          id: '123',
          signed_upload_url: 'http://s3.signed.url.com',
        }),
      },
    })

    this.req = {
      session: {
        token: '1234',
      },
      flash: sinon.spy(),
      params: {
        kind: 'interaction',
      },
    }
    this.res = {
      locals: {
        documents: {
          index: 2,
          file: {
            name: 'document.txt',
          },
          fields: {
            'investment': '123',
            'proposition': '345',
          },
          url: {
            app: 'investment',
            subApp: 'proposition',
          },
        },
      },
      status: sinon.spy(),
    }
    this.nextSpy = sinon.spy()

    this.actual = this.res.locals.results
  })

  describe('#getDocumentUploadS3Url', () => {
    context('When there are multiple files submitted and no text fields in the form', () => {
      beforeEach(async () => {
        await this.repos.getDocumentUploadS3Url(this.req, this.res)
      })

      it('should only post to the API the name of the document', () => {
        const url = `http://localhost:8000/v3/investment/123/proposition/345/document`
        const body = {
          original_filename: 'document.txt',
        }

        const options = {
          body,
          method: 'POST',
          url,
        }

        expect(this.authorisedRequestStub).to.be.calledWith(this.req.session.token, options)
      })
    })

    context('When there is a single file submitted and there are text fields in the form', () => {
      beforeEach(async () => {
        this.res.locals.documents.index = 1
        this.res.locals.requestBody = {
          title: 'Best Recipies',
          message: 'Have an apple every day',
        }

        await this.repos.getDocumentUploadS3Url(this.req, this.res)
      })

      it('should only post to the API the name of the document and the text fields', () => {
        const url = `http://localhost:8000/v3/investment/123/proposition/345/document`
        const body = {
          original_filename: 'document.txt',
          title: 'Best Recipies',
          message: 'Have an apple every day',
        }

        const options = {
          body,
          method: 'POST',
          url,
        }

        expect(this.authorisedRequestStub).to.be.calledWith(this.req.session.token, options)
      })
    })
  })
})
