/* globals expect: true, describe: true, it: true, beforeEach: true */
/* eslint no-unused-expressions: 0 */
const { render } = require('../nunjucks')
const contactController = require('../../src/controllers/contactcontroller')
const { contactDetailsLabels } = require('../../src/labels/contactlabels')

describe('Contact controller, getDetails', function () {
  let contact

  beforeEach(function () {
    contact = {
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
      address_1: '10 The Street',
      address_2: 'Warble',
      address_3: '',
      address_4: '',
      address_town: 'Big Town',
      address_county: 'Large County',
      address_postcode: 'LL1 1LL',
      telephone_alternative: '07814 000 333',
      email_alternative: 'fred@gmail.com',
      notes: 'some notes',
      archived_by: null,
      title: {
        id: 'a26cb21e-6095-e211-a939-e4115bead28a',
        name: 'Mr',
        selectable: true
      },
      advisor: null,
      address_country: null,
      teams: [],
      company: {
        name: 'Bank ltd.'
      }
    }
  })
  describe('data', function () {
    it('should include formatted contact data', function (done) {
      const req = {
        session: {}
      }
      const res = {
        locals: { contact, id: '1234' },
        render: function (url, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions).to.have.property('contactDetails')
          expect(allOptions).to.have.property('contactDetailsLabels')
          expect(allOptions.contactDetailsLabels).to.deep.equal(contactDetailsLabels)
          done()
        }
      }
      contactController.getDetails(req, res, null)
    })
  })
  describe('markup', function () {
    let contactDetails

    beforeEach(function () {
      contactDetails = {
        title: 'Mr',
        job_title: 'Director',
        telephone_number: '+44 7814 333 777',
        email: 'fred@test.com',
        address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
        telephone_alternative: '07814 000 333',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes'
      }
    })

    it('should render a contact details section', function () {
      return render(`${__dirname}/../../src/views/contact/details.html`, {contact, contactDetails, contactDetailsLabels})
      .then((document) => {
        expect(document.getElementById('contact-details')).to.not.be.null
      })
    })
    it('should include the contact details in a key value table', function () {
      return render(`${__dirname}/../../src/views/contact/details.html`, {contact, contactDetails, contactDetailsLabels})
      .then((document) => {
        const details = document.getElementById('contact-details')
        expect(details.innerHTML).to.include(contactDetails.title)
        expect(details.innerHTML).to.include(contactDetails.job_title)
        expect(details.innerHTML).to.include(contactDetails.telephone_number)
        expect(details.innerHTML).to.include(contactDetails.email)
        expect(details.innerHTML).to.include(contactDetails.address)
        expect(details.innerHTML).to.include(contactDetails.telephone_alternative)
        expect(details.innerHTML).to.include(contactDetails.email_alternative)
        expect(details.innerHTML).to.include(contactDetails.notes)
      })
    })
    it('should display the contact name and address in a heading', function () {
      return render(`${__dirname}/../../src/views/contact/details.html`, {contact, contactDetails, contactDetailsLabels})
      .then((document) => {
        const heading = document.querySelector('h1.page-heading')
        expect(heading.innerHTML).to.include('Fred Smith')
        expect(heading.innerHTML).to.include('Bank ltd')
      })
    })
    it('should indicate primary contacts', function () {
      return render(`${__dirname}/../../src/views/contact/details.html`, {contact, contactDetails, contactDetailsLabels})
      .then((document) => {
        const heading = document.querySelector('h1.page-heading')
        expect(heading.innerHTML).to.include('<span class="status-badge status-badge--fuschia ">Primary</span>')
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
