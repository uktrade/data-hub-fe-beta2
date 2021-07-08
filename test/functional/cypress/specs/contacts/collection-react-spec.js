import { assertBreadcrumbs } from '../../support/assertions'
import { contacts } from '../../../../../src/lib/urls'
import { contactsListFaker, contactFaker } from '../../fakers/contacts'

describe('Contacts Collections - React', () => {
  const ukContact = contactFaker({
    id: '1',
    first_name: 'Hanna',
    last_name: 'Reinger',
    name: 'Hanna Reinger',
    job_title: 'Dynamic Accountability Administrator',
    email: 'gloria33@gmail.com',
    archived: false,
    company: {
      name: 'Murray, Price and Hodkiewicz',
    },
    company_uk_region: {
      name: 'London',
    },
    company_sector: {
      name: 'Advanced Engineering',
    },
    primary: true,
    telephone_number: '02071234567',
    modified_on: '2020-08-10T19:09:35.276Z',
  })

  const foreignContact = contactFaker({
    id: '2',
    first_name: 'Ted',
    last_name: 'Woods',
    name: 'Ted Woods',
    company_uk_region: null,
    address_country: {
      name: 'United States',
    },
    primary: false,
    telephone_countrycode: '0045',
    telephone_number: '48770000',
  })

  const archivedContact = contactFaker({
    id: '3',
    archived: true,
  })

  const contactsList = [
    ukContact,
    foreignContact,
    archivedContact,
    ...contactsListFaker(7),
  ]

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

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
    cy.get('@collectionItems').eq(1).as('secondListItem')
    cy.get('@collectionItems').eq(2).as('thirdListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Contacts: null,
    })
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Contacts')
  })

  it('should display a list of contacts', () => {
    cy.get('@collectionList').should('have.length', 1)
    cy.get('@collectionItems').should('have.length', contactsList.length)
  })

  context('UK contact', () => {
    it('should have a link with the contact name', () => {
      cy.get('@firstListItem')
        .find('h3')
        .children()
        .should('have.text', 'Hanna Reinger')
        .should('have.attr', 'href', '/contacts/1/details')
    })

    it('should contain a primary contact badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .should('contain', 'Primary')
    })

    it('should not contain an archived badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .should('not.contain', 'Archived')
    })

    it('should render the updated date and time', () => {
      cy.get('@firstListItem')
        .find('h4')
        .should('have.text', 'Updated on 10 Aug 2020, 8:09pm')
    })

    it('should render the company name', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('contain', 'Company Murray, Price and Hodkiewicz')
    })

    it('should render the job title', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('contain', 'Job title Dynamic Accountability Administrator')
    })

    it('should render the sector', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should('contain', 'Sector Advanced Engineering')
    })

    it('should render the country', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('contain', 'Country United Kingdom')
    })

    it('should render the UK region', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(4)
        .should('contain', 'UK region London')
    })

    it('should render the UK telephone number', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(5)
        .should('contain', 'Phone number (0044) 02071234567')
    })

    it('should render the email', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(6)
        .should('contain', 'Email gloria33@gmail.com')
    })
  })

  context('Foreign contact', () => {
    it('should have a link with the contact name', () => {
      cy.get('@secondListItem')
        .find('h3')
        .children()
        .should('have.text', 'Ted Woods')
        .should('have.attr', 'href', '/contacts/2/details')
    })

    it('should not contain a primary contact badge', () => {
      cy.get('@secondListItem').find('[data-test="badge"]').should('not.exist')
    })

    it('should render the foreign country', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('contain', 'Country United States')
    })
    it('should not render the UK region', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .should('not.contain', 'UK region')
    })
    it('should render the telephone number', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(4)
        .should('contain', 'Phone number (0045) 48770000')
    })
  })

  context('Archived contact', () => {
    it('should contain an archived badge', () => {
      cy.get('@thirdListItem')
        .find('[data-test="badge"]')
        .should('contain', 'Archived')
    })
  })
})
