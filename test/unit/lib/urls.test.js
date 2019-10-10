const faker = require('faker')
const proxyquire = require('proxyquire')

const modulePath = '../../../src/lib/urls'

describe('urls', () => {
  let urls
  before(() => {
    urls = proxyquire(modulePath, {
      '../../config': {
        greatProfileUrl: 'http://a.b.c.com/path/{id}',
      },
    })
  })

  describe('external', () => {
    it('should have the correct urls', () => {
      const companyNumber = faker.random.alphaNumeric(8)
      expect(urls.external.greatProfile(companyNumber)).to.equal(`http://a.b.c.com/path/${companyNumber}`)
    })
  })

  describe('companies', () => {
    let companyId
    beforeEach(() => {
      companyId = faker.random.uuid()
    })
    it('should return the correct values', () => {
      expect(urls.companies.detail(companyId)).to.equal(`/companies/${companyId}`)
      expect(urls.companies.exports(companyId)).to.equal(`/companies/${companyId}/exports`)
    })
  })
})
