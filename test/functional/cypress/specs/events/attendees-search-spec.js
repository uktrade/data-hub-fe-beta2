const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Event attendee search', () => {
  beforeEach(() => {
    cy.visit(urls.events.find(fixtures.event.oneDayExhibition.id))
    cy.get('[data-test="bodyMainContent"] h2')
      .as('header')
      .next()
      .as('form')
      .find('input')
      .as('input')
      .next()
      .as('button')

    cy.get('@form').next().as('message')
  })
  context('with results', () => {
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Events: urls.events.index(),
        'One-day exhibition': urls.events.attendees(
          fixtures.event.oneDayExhibition.id
        ),
        'Add attendee': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('One-day exhibition')
    })

    it('should display a form for searching', () => {
      cy.get('@header').should('contain', 'Add event attendee')

      cy.get('@form').find('label').should('contain', 'Find the contact')

      cy.get('@input').should(
        'have.attr',
        'placeholder',
        'Contact or company name to search for'
      )
      cy.get('@message').should(
        'contain',
        'Enter the name of the contact, or company, into the search box and press enter to search.'
      )
    })

    it('should display results', () => {
      cy.get('@input').type('lambda')
      cy.get('@button').click()
      cy.get('.c-collection header').should(
        'contain',
        '1 contact matching lambda'
      )
      cy.get('@message').should(
        'contain',
        "Select the contact to show they attended the event. If you can't find the contact, you should check they have been added to the company record before returning to this event to record their attendance."
      )
    })
  })
  context('with no results', () => {
    it('should display a no results header', () => {
      cy.get('@input').type('no results')
      cy.get('@button').click()
      cy.get('.c-collection header').should(
        'contain',
        '0 contacts matching no results'
      )
    })
  })
})
