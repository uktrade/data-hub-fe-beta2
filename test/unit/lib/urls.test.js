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
      expect(urls.companies.collection.route).to.equal('/')
      expect(urls.companies.collection()).to.equal('/companies')

      expect(urls.companies.detail.route).to.equal('/:companyId')
      expect(urls.companies.detail(companyId)).to.equal(`/companies/${companyId}`)

      expect(urls.companies.exports.route).to.equal('/:companyId/exports')
      expect(urls.companies.exports(companyId)).to.equal(`/companies/${companyId}/exports`)

      const globalHqId = faker.random.uuid()
      expect(urls.companies.hierarchies.ghq.add.route).to.equal('/:companyId/hierarchies/ghq/:globalHqId/add')
      expect(urls.companies.hierarchies.ghq.add(companyId, globalHqId)).to.equal(`/companies/${companyId}/hierarchies/ghq/${globalHqId}/add`)
    })
  })
})
