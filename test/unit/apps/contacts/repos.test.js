const config = require('config')

const {
  getContactsForCompany,
} = require('src/apps/contacts/repos')

const contactsApiResult = require('test/unit/data/contacts/contact-api-result.json')
const companyId = '23232323'

describe('Investment repository', () => {
  describe('#getContactsForCompany', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/contact?company_id=${companyId}&limit=500`)
        .reply(200, contactsApiResult)
      this.contacts = await getContactsForCompany('token', companyId)
    })

    it('should return company contacts array', async () => {
      expect(this.contacts).to.deep.equal(contactsApiResult.results)
    })
  })
})
