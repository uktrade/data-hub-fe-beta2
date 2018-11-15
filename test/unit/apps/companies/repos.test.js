/* eslint prefer-promise-reject-errors: 0 */
const companyData = require('~/test/unit/data/company.json')

describe('Company repository', () => {
  describe('Save company', () => {
    describe('Handle response from server', () => {
      describe('Successfully save a company', () => {
        let companyRepository
        const authorisedRequestStub = () => {
          return new Promise((resolve) => {
            resolve({
              id: '1234',
              name: 'fred',
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return data if successful', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then((data) => {
              expect(data.id).to.equal('1234')
              done()
            })
            .catch(() => {
              fail()
            })
        })
      })
      describe('Save a company and get a 400', () => {
        let companyRepository
        const authorisedRequestStub = () => {
          return new Promise((resolve, reject) => {
            reject({
              error: {
                sector: ['error with sector'],
              },
              message: '400 - {"sector":["error with sector"]}',
              name: 'StatusCodeError',
              response: {
                statusCode: 400,
                statusMessage: 'Bad Request',
              },
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(400)
              done()
            })
        })
        it('should show that there was an error with a field', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.errors).to.eql({
                sector: ['error with sector'],
              })
              done()
            })
        })
      })
      describe('Save a company and get a formatted 500', () => {
        let companyRepository
        const authorisedRequestStub = () => {
          return new Promise((resolve, reject) => {
            reject({
              error: { 'detail': 'Service Unavailable' },
              name: 'StatusCodeError',
              response: {
                statusCode: 501,
              },
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(501)
              expect(error.errors).to.eql({ detail: 'Service Unavailable' })
              done()
            })
        })
      })
      describe('Save a company and get a generic 500', () => {
        let companyRepository
        const authorisedRequestStub = () => {
          return new Promise((resolve, reject) => {
            reject({
              error: 'Service Unavailable',
              message: '503 "Service Unavailable"',
              name: 'StatusCodeError',
              response: {
                statusCode: 501,
                statusMessage: 'Service Unavailable',
              },
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(501)
              expect(error.errors).to.eql({ detail: 'Service Unavailable' })
              done()
            })
        })
      })
    })
    describe('Make correct call to API', () => {
      it('should call the API with a PATCH if an ID is provided.', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.method).to.eq('PATCH')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API at /v3/company/id if an ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/v3/company/1234')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API with a POST if no ID is provided.', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.method).to.eq('POST')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API at /v3/company if no ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/v3/company')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
    })
  })

  describe('Update company', () => {
    beforeEach(() => {
      this.authorisedRequestStub = sinon.stub().resolves(companyData)
      this.repo = proxyquire('~/src/apps/companies/repos', {
        '../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
        '../../../config': {
          apiRoot: 'http://test.com',
        },
      })
    })

    it('should make the correct call to the API', () => {
      return this.repo.updateCompany('1234', '999', { global_headquarters: '1' })
        .then(() => {
          expect(this.authorisedRequestStub).to.be.calledWith('1234', {
            url: 'http://test.com/v3/company/999',
            method: 'PATCH',
            body: {
              global_headquarters: '1',
            },
          })
        })
    })
  })

  function makeRepositoryWithAuthRequest (authorisedRequestStub) {
    return proxyquire('~/src/apps/companies/repos', {
      '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
    })
  }

  function fail () {
    expect(true).to.eq(false)
  }
})
