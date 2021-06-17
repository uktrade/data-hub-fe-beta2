import urls from '../../../../../src/lib/urls'
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

      cy.visit(urls.contacts.react.index())
      cy.wait('@apiRequest')
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => o.value)
        expect(sortOptions).to.deep.eq([
          'created_on:desc',
          'created_on:asc',
          'modified_on:desc',
          'modified_on:asc',
          'last_name:asc',
          'address_country.name:asc',
          'company.name:asc',
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

      cy.visit(urls.contacts.react.index())
      cy.wait('@apiRequest')
    })

    it('should sort by "Newest"', () => {
      cy.get(element).select('created_on:desc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:desc')
      })
    })

    it('should sort by "Oldest"', () => {
      cy.get(element).select('created_on:asc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:asc')
      })
    })

    it('should sort by "Recently updated"', () => {
      cy.get(element).select('modified_on:desc')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should sort by "Least recently updated"', () => {
      cy.get(element).select('modified_on:asc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:asc')
      })
    })

    it('should sort by "Last name: A-Z"', () => {
      cy.get(element).select('last_name:asc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('last_name:asc')
      })
    })

    it('should sort by "Country: A-Z"', () => {
      cy.get(element).select('address_country.name:asc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('address_country.name:asc')
      })
    })

    it('should sort by "Company: name A-Z"', () => {
      cy.get(element).select('company.name:asc')
      cy.wait('@apiRequest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('company.name:asc')
      })
    })
  })
})
