/* eslint prefer-promise-reject-errors: 0 */
const companyData = require('~/test/unit/data/company.json')
const companyV4Data = require('~/test/unit/data/companies/company-v4.json')
const myCompanyListData = require('~/test/unit/data/companies/my-company-list.json')

const config = require('~/config')

const {
  getDitCompany,
  saveDnbCompany,
  saveDnbCompanyInvestigation,
} = require('~/src/apps/companies/repos.js')

function makeRepositoryWithAuthRequest (authorisedRequestStub) {
  return proxyquire('~/src/apps/companies/repos', {
    '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
  })
}

describe('Company repository', () => {
  describe('Save company', () => {
    describe('Make correct call to API', () => {
      beforeEach(() => {
        this.authorisedRequestStub = sinon.stub().resolves({
          id: 'TEST_TOKEN',
          name: 'fred',
        })
        this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
      })

      it('should call the API with a PATCH if an ID is provided.', async () => {
        await this.repo.saveCompany('TEST_TOKEN', { id: 'TEST_TOKEN', name: 'fred' })
        expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
          body: { id: 'TEST_TOKEN', name: 'fred' },
          method: 'PATCH',
          url: `${config.apiRoot}/v4/company/TEST_TOKEN`,
        })
      })

      it('should call the API with a POST if no ID is provided.', async () => {
        await this.repo.saveCompany('TEST_TOKEN', { name: 'fred' })
        expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
          body: { name: 'fred' },
          method: 'POST',
          url: `${config.apiRoot}/v4/company`,
        })
      })
    })
  })

  describe('Update company', () => {
    beforeEach(() => {
      this.authorisedRequestStub = sinon.stub().resolves(companyData)
      this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
    })

    it('should make the correct call to the API', async () => {
      await this.repo.updateCompany('TEST_TOKEN', '999', { global_headquarters: '1' })
      expect(this.authorisedRequestStub).to.be.calledOnceWithExactly('TEST_TOKEN', {
        url: `${config.apiRoot}/v4/company/999`,
        method: 'PATCH',
        body: {
          global_headquarters: '1',
        },
      })
    })
  })

  describe('#getDitCompany', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get(`/v4/company/${companyV4Data.id}`)
        .reply(200, companyV4Data)
    })

    it('should return company', async () => {
      const company = await getDitCompany('TEST_TOKEN', companyV4Data.id)
      expect(company).to.deep.equal(companyV4Data)
    })
  })

  describe('#getDitCompanyFromList', () => {
    it('should call the API with a GET to see if the company exists in the list', async () => {
      this.authorisedRequestStub = sinon.stub()
      this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
      await this.repo.getDitCompanyFromList('TEST_TOKEN', myCompanyListData.id)
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
        method: 'GET',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#addDitCompanyToList', () => {
    it('should call the API with a PUT to add company to the list', async () => {
      this.authorisedRequestStub = sinon.stub()
      this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
      await this.repo.addDitCompanyToList('TEST_TOKEN', myCompanyListData.id)
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
        method: 'PUT',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#removeDitCompanyToList', () => {
    it('should call the API with a DELETE to remove company from the list', async () => {
      this.authorisedRequestStub = sinon.stub()
      this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
      await this.repo.removeDitCompanyFromList('TEST_TOKEN', myCompanyListData.id)
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
        method: 'DELETE',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#saveDnbCompany', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post('/v4/dnb/company-create', {
          duns_number: '123',
        })
        .reply(200, {
          hello: true,
        })

      this.actual = await saveDnbCompany('1234', '123')
    })

    it('should respond successfully', () => {
      expect(this.actual).to.deep.equal({ hello: true })
    })
  })

  describe('#saveDnbCompanyInvestigation', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post('/v4/dnb/company-create-investigation', {
          name: 'name',
        })
        .reply(200, {
          hello: true,
        })

      this.actual = await saveDnbCompanyInvestigation('1234', { name: 'name' })
    })

    it('should respond successfully', () => {
      expect(this.actual).to.deep.equal({ hello: true })
    })
  })
})
