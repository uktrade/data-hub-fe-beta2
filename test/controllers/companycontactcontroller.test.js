/* globals expect: true, describe: true, it: true, beforeEach: true */
const { render } = require('../nunjucks')
const contactTemplate = '../../src/views/company/contacts.html'

describe('Company contacts controller', function () {
  let company
  const companycontactcontroller = require('../../src/controllers/companycontactcontroller')

  beforeEach(function () {
    company = {
      id: '3f2b2a0f-0eb6-4299-8489-7390ccaa17f5',
      name: 'Fred',
      trading_name: '',
      companies_house_data: null,
      interactions: null,
      contacts: [{
        id: '12651151-2149-465e-871b-ac45bc568a62',
        created_on: '2017-02-14T14:49:17',
        modified_on: '2017-02-14T14:49:17',
        archived: false,
        archived_on: null,
        archived_reason: '',
        first_name: 'Fred',
        last_name: 'Smith',
        job_title: 'Director',
        primary: true,
        telephone_countrycode: '+44',
        telephone_number: '07814 333 777',
        email: 'fred@test.com',
        address_same_as_company: false,
        address_1: '',
        address_2: '',
        address_3: '',
        address_4: '',
        address_town: '',
        address_county: '',
        address_postcode: '',
        telephone_alternative: null,
        email_alternative: null,
        notes: null,
        archived_by: null,
        title: {
          id: 'a26cb21e-6095-e211-a939-e4115bead28a',
          name: 'Mr',
          selectable: true
        },
        advisor: null,
        address_country: null,
        teams: []
      },
      {
        id: '12651151-2149-465e-871b-ac45bc568a63',
        created_on: '2017-02-14T14:49:17',
        modified_on: '2017-02-14T14:49:17',
        archived: false,
        archived_on: null,
        archived_reason: '',
        first_name: 'John',
        last_name: 'Smith',
        job_title: 'Director',
        primary: true,
        telephone_countrycode: '+44',
        telephone_number: '07814 333 777',
        email: 'john@test.com',
        address_same_as_company: false,
        address_1: '',
        address_2: '',
        address_3: '',
        address_4: '',
        address_town: '',
        address_county: '',
        address_postcode: '',
        telephone_alternative: null,
        email_alternative: null,
        notes: null,
        archived_by: null,
        title: {
          id: 'a26cb21e-6095-e211-a939-e4115bead28a',
          name: 'Mr',
          selectable: true
        },
        advisor: null,
        address_country: null,
        teams: []
      },
      {
        id: '12651151-2149-465e-871b-ac45bc568a64',
        created_on: '2017-02-14T14:49:17',
        modified_on: '2017-02-14T14:49:17',
        archived: true,
        archived_on: '2017-02-14T14:49:17',
        archived_reason: 'Contact has left the company',
        first_name: 'Jane',
        last_name: 'Smith',
        job_title: 'Director',
        primary: true,
        telephone_countrycode: '+44',
        telephone_number: '07814 333 777',
        email: 'jane@test.com',
        address_same_as_company: false,
        address_1: '',
        address_2: '',
        address_3: '',
        address_4: '',
        address_town: '',
        address_county: '',
        address_postcode: '',
        telephone_alternative: null,
        email_alternative: null,
        notes: null,
        archived_by: {
          id: '5707c18a-454a-4bd2-b14b-218761a684bc',
          password: 'pbkdf2_sha256$30000$CcwYNPOk7Q0S$Isy9CB/NLd9eKXJfVtR7mgi1Shj4OiavmgqhZ/vCnMs=',
          last_login: '2017-02-27T15:51:27.258250',
          is_superuser: true,
          first_name: 'Zac',
          last_name: 'Tolley',
          email: 'zac.tolley@digital.trade.gov.uk',
          is_staff: true,
          is_active: true,
          date_joined: '2017-02-20T10:33:14',
          enabled: false,
          dit_team: '0167b456-0ddd-49bd-8184-e3227a0b6396',
          groups: [],
          user_permissions: []
        },
        title: {
          id: 'a26cb21e-6095-e211-a939-e4115bead28a',
          name: 'Mr',
          selectable: true
        },
        advisor: null,
        address_country: null,
        teams: []
      }],
      export_to_countries: [],
      future_interest_countries: [],
      uk_based: true,
      account_manager: null,
      registered_address_1: 'Annexe -  Blackthorn Cottage',
      registered_address_2: 'Chawridge Lane',
      registered_address_3: '',
      registered_address_4: '',
      registered_address_town: 'Windsor',
      registered_address_country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United Kingdom'
      },
      registered_address_county: 'Berkshire',
      registered_address_postcode: 'SL4 4QR',
      created_on: '2016-10-24T12:06:14',
      modified_on: '2016-10-24T12:06:14',
      archived: false,
      archived_on: null,
      archived_reason: null,
      company_number: null,
      alias: '',
      lead: false,
      description: '',
      website: null,
      trading_address_1: '',
      trading_address_2: '',
      trading_address_3: '',
      trading_address_4: '',
      trading_address_town: '',
      trading_address_county: '',
      trading_address_postcode: '',
      archived_by: null,
      business_type: {
        id: '9bd14e94-5d95-e211-a939-e4115bead28a',
        name: 'Intermediary',
        selectable: true
      },
      sector: {
        id: 'b722c9d2-5f95-e211-a939-e4115bead28a',
        name: 'Aerospace : Maintenance',
        selectable: true
      },
      employee_range: null,
      turnover_range: null,
      uk_region: {
        id: '844cd12a-6095-e211-a939-e4115bead28a',
        name: 'East Midlands',
        selectable: true
      },
      trading_address_country: null,
      headquarter_type: null,
      classification: null
    }
  })

  describe('data', function () {
    let res
    let req
    let locals
    beforeEach(function (done) {
      req = {
        session: {}
      }
      res = {
        locals: {
          headingName: 'Freds Company',
          headingAddress: '1234 Road, London, EC1 1AA',
          id: '44332211',
          source: 'company_company',
          company
        },
        render: function (template, options) {
          locals = Object.assign({}, res.locals, options)
          done()
        }
      }
      companycontactcontroller.getContacts(req, res)
    })

    it('should return a list of contacts not archived', function () {
      expect(locals).to.have.property('contacts')
      expect(locals.contacts).to.have.length(2)
    })
    it('should return a list of archived contacts', function () {
      expect(locals).to.have.property('contactsArchived')
      expect(locals.contactsArchived).to.have.length(1)
    })
    it('should return the required fields to list un-archived contacts', function () {
      const contact = locals.contacts[0]
      expect(contact.url).to.equal('/contact/12651151-2149-465e-871b-ac45bc568a62/details')
      expect(contact.name).to.equal('Fred Smith')
      expect(contact.job_title).to.equal('Director')
      expect(contact.telephone_number).to.equal('+44 7814 333 777')
      expect(contact.added).to.equal('14 February 2017')
      expect(contact.email).to.equal('fred@test.com')
    })
    it('should return the required fields to list archived contacts', function () {
      const contact = locals.contactsArchived[0]
      expect(contact.url).to.equal('/contact/12651151-2149-465e-871b-ac45bc568a64/details')
      expect(contact.name).to.equal('Jane Smith')
      expect(contact.job_title).to.equal('Director')
      expect(contact.reason).to.equal('Contact has left the company')
    })
    it('should return a link to add a new contact', function () {
      expect(locals.addContactUrl).to.equal('/contact/add?company=3f2b2a0f-0eb6-4299-8489-7390ccaa17f5')
    })
  })

  describe('markup', function () {
    let contacts
    let contactsArchived
    let addContactUrl

    beforeEach(function () {
      contacts = [{
        url: '/contact/1/details',
        name: 'Fred Smith',
        job_title: 'Director',
        telephone_number: '+44 7788 112 332',
        email: 'fred@acme.org',
        added: '23 February 2017'
      }, {
        url: '/contact/2/details',
        name: 'Jane Smith',
        job_title: 'Director',
        telephone_number: '+44 7788 112 332',
        email: 'Jane@acme.org',
        added: '23 February 2017'
      }]

      contactsArchived = [{
        url: '/contact/3/details',
        name: 'John Smith',
        job_title: 'Director',
        reason: 'Left company'
      }]

      addContactUrl = '/contact/add?company=1234'
    })

    it('should render a list of un-archived contacts', function () {
      return render(contactTemplate, {contacts, contactsArchived, addContactUrl, company})
      .then((document) => {
        expect(document.getElementById('contact-list')).to.not.be.null
      })
    })
    it('should render a list of archived contacts', function () {
      return render(contactTemplate, {contacts, contactsArchived, addContactUrl, company})
      .then((document) => {
        expect(document.getElementById('archived-contact-list')).to.not.be.null
      })
    })
    it('each un-archived line should include the required data', function () {
      return render(contactTemplate, {contacts, contactsArchived, addContactUrl, company})
      .then((document) => {
        const contactElement = document.querySelector('#contact-list .contact')
        expect(contactElement.innerHTML).to.include('Fred Smith')
        expect(contactElement.innerHTML).to.include('Director')
        expect(contactElement.innerHTML).to.include('23 February 2017')
        expect(contactElement.innerHTML).to.include('+44 7788 112 332')
        expect(contactElement.innerHTML).to.include('fred@acme.org')
        expect(contactElement.innerHTML).to.include('/contact/1/details')
      })
    })
    it('each archived line should include the required data', function () {
      return render(contactTemplate, {contacts, contactsArchived, addContactUrl, company})
      .then((document) => {
        const contactElement = document.querySelector('#archived-contact-list .contact')
        expect(contactElement.innerHTML).to.include('John Smith')
        expect(contactElement.innerHTML).to.include('Director')
        expect(contactElement.innerHTML).to.include('Left company')
        expect(contactElement.innerHTML).to.include('/contact/3/details')
      })
    })
    it('include a link to add a new contact', function () {
      return render(contactTemplate, {contacts, contactsArchived, addContactUrl, company})
      .then((document) => {
        const link = document.querySelector('a#add-contact-link')
        expect(link.href).to.eq('/contact/add?company=1234')
      })
    })
    it('should not render contacts section if there are none and warn user', function () {
      return render(contactTemplate, {contacts: [], contactsArchived, addContactUrl, company})
      .then((document) => {
        expect(document.getElementById('contact-list')).to.be.null
        expect(document.querySelector('#no-contact-warning.infostrip').textContent).to.include('There are no contacts at this time.')
      })
    })
    it('should not render archived contacts section if there are none', function () {
      return render(contactTemplate, {contacts: [], contactsArchived: [], addContactUrl, company})
      .then((document) => {
        expect(document.getElementById('archived-contact-list')).to.be.null
        expect(document.getElementById('archived-title')).to.be.null
      })
    })
  })
})
