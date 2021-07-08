import { contacts } from '../../../../../src/lib/urls'
import { contactsListFaker } from '../../fakers/contacts'

describe('Contact Collections Sort', () => {
  context('Default sort', () => {
    const contactsList = contactsListFaker(10)
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contactsList.length,
          results: contactsList,
        },
      }).as('apiRequest')

      cy.visit(contacts.index())
      cy.wait('@apiRequest')
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          label: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'created_on:asc', label: 'Oldest' },
          { value: 'modified_on:desc', label: 'Recently updated' },
          { value: 'modified_on:asc', label: 'Least recently updated' },
          { value: 'last_name:asc', label: 'Last name A-Z' },
          { value: 'address_country.name:asc', label: 'Country A-Z' },
          { value: 'company.name:asc', label: 'Company A-Z' },
        ])
      })
    })
  })

  context('User sort', () => {
    const contactsList = contactsListFaker(10)
    const element = '[data-test="sortby"] select'
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contactsList.length,
          results: contactsList,
        },
      }).as('apiRequest')
      cy.visit(`${contacts.index()}?page=1`)
      cy.wait('@apiRequest')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Recently created')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:desc')
      })
    })

    it('should sort by "Oldest"', () => {
      cy.get(element).select('Oldest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:asc')
      })
    })

    it('should sort by "Recently updated"', () => {
      cy.get(element).select('Recently updated')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should sort by "Least recently updated"', () => {
      cy.get(element).select('Least recently updated')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:asc')
      })
    })

    it('should sort by "Last name A-Z"', () => {
      cy.get(element).select('Last name A-Z')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('last_name:asc')
      })
    })

    it('should sort by "Country A-Z"', () => {
      cy.get(element).select('Country A-Z')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('address_country.name:asc')
      })
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company A-Z')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('company.name:asc')
      })
    })
  })
})
