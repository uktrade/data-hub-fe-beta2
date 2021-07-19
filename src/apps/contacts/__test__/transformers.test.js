const { assign } = require('lodash')
const contact = require('../../../../test/unit/data/contacts/contact.json')
const company = require('../../../../test/unit/data/companies/companies-house-company.json')

const { transformContactToView } = require('../transformers')

describe('Contact transformers', () => {
  describe('#transformContactToView', () => {
    context('when the contact record is fully populated', () => {
      beforeEach(() => {
        this.view = transformContactToView(contact, company)
      })

      it('should return all the required fields', () => {
        expect(this.view).to.have.ordered.keys([
          'Job title',
          'Phone number',
          'Alternative telephone',
          'Address',
          'Email',
          'Alternative email',
          'Notes',
          'Email marketing',
        ])
      })

      it('should return the job title', () => {
        expect(this.view).to.have.property(
          'Job title',
          'Forward Quality Associate'
        )
      })

      it('should return the alternative phone number', () => {
        expect(this.view).to.have.property('Alternative telephone', '666555444')
      })

      it('should return the main email', () => {
        expect(this.view).to.have.property('Email', 'Rebecca.Lowe@example.com')
      })

      it('should return the alternative email', () => {
        expect(this.view).to.have.property(
          'Alternative email',
          'Lowe.Rebecca@example.com'
        )
      })

      it('should return the notes', () => {
        expect(this.view).to.have.property('Notes', 'ProductRebecca')
      })
    })

    context(
      'when the contact does not want to receive marketing by email',
      () => {
        beforeEach(() => {
          this.view = transformContactToView(
            assign({}, contact, {
              accepts_dit_email_marketing: false,
            }),
            company
          )
        })

        it('should show that they do not want to receive marketing by email', () => {
          expect(this.view).to.have.property(
            'Email marketing',
            'Cannot be marketed to'
          )
        })
      }
    )

    context(
      'when the contact does want to receiving marketing by email',
      () => {
        beforeEach(() => {
          this.view = transformContactToView(
            assign({}, contact, {
              accepts_dit_email_marketing: true,
            }),
            company
          )
        })

        it('should show that they do not want to receive marketing by email', () => {
          expect(this.view).to.have.property(
            'Email marketing',
            'Can be marketed to'
          )
        })
      }
    )

    context('when the contact has an empty international dialling code', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          assign({}, contact, {
            telephone_countrycode: '',
            telephone_number: '1234',
          }),
          company
        )
      })

      it('should set the telephone number without a dialling code', () => {
        expect(this.view).to.have.property('Phone number', '1234')
      })
    })

    context(
      'when the contact does not have an international dialling code',
      () => {
        beforeEach(() => {
          this.view = transformContactToView(
            assign({}, contact, {
              telephone_countrycode: null,
              telephone_number: '1234',
            }),
            company
          )
        })

        it('should set the telephone number without a dialling code', () => {
          expect(this.view).to.have.property('Phone number', '1234')
        })
      }
    )

    context('when the contact has an international dialling code', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          assign({}, contact, {
            telephone_countrycode: '44',
            telephone_number: '1234',
          }),
          company
        )
      })

      it('should set the telephone number with the dialling code', () => {
        expect(this.view).to.have.property('Phone number', '(44) 1234')
      })
    })

    context('when the contact has their own address', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          assign({}, contact, {
            address_1: 'Bridge House',
            address_2: 'Bridge Lane',
            address_town: 'Maidenhead',
            address_county: 'Berkshire',
            address_country: {
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
              name: 'United Kingdom',
            },
            address_postcode: 'SL1 11LL',
            address_same_as_company: false,
          }),
          company
        )
      })

      it('uses the contacts address', () => {
        expect(this.view.Address).to.deep.equal({
          type: 'address',
          address: {
            line_1: 'Bridge House',
            line_2: 'Bridge Lane',
            town: 'Maidenhead',
            county: 'Berkshire',
            postcode: 'SL1 11LL',
            country: {
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
              name: 'United Kingdom',
            },
          },
        })
      })
    })

    context('when the contact uses a company trading address', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          {
            ...contact,
            address_same_as_company: true,
          },
          {
            ...company,
            address: {
              line_1: 'Business Innovation & Skills',
              line_2: '1 Victoria Street',
              town: 'London',
              county: 'Greater London',
              postcode: 'SW1H 0ET',
              country: {
                name: 'United Kingdom',
                id: '80756b9a-5d95-e211-a939-e4115bead28a',
              },
            },
            registered_address: {
              line_1: '5TH FLOOR, PROFILE WEST',
              line_2: '950 GREAT WEST ROAD',
              town: 'BRENTFORD',
              county: 'MIDDLESEX',
              postcode: 'TW8 9ES',
              country: {
                name: 'United Kingdom',
                id: '80756b9a-5d95-e211-a939-e4115bead28a',
              },
            },
          }
        )
      })

      it('should use the company trading address', () => {
        expect(this.view.Address).to.deep.equal({
          type: 'address',
          address: {
            line_1: 'Business Innovation & Skills',
            line_2: '1 Victoria Street',
            town: 'London',
            county: 'Greater London',
            postcode: 'SW1H 0ET',
            country: {
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
              name: 'United Kingdom',
            },
          },
        })
      })
    })
  })
})
