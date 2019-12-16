const selectors = require('../../../../selectors')

const { events } = require('../../../../../src/lib/urls')

const { assertKeyValueTable } = require('../../support/assertions')

const today = Cypress.moment()

const createEvent = () => {
  cy.get(selectors.eventCreate.eventName).type('Eventful event')
  cy.get(selectors.eventCreate.eventType).select('Account management')
  cy.get(selectors.eventCreate.startDateDay).type(today.format('DD'))
  cy.get(selectors.eventCreate.startDateMonth).type(today.format('MM'))
  cy.get(selectors.eventCreate.startDateYear).type(today.format('YYYY'))
  cy.get(selectors.eventCreate.endDateDay).type(today.format('DD'))
  cy.get(selectors.eventCreate.endDateMonth).type(today.format('MM'))
  cy.get(selectors.eventCreate.endDateYear).type(today.format('YYYY'))
  cy.get(selectors.eventCreate.addressLine1).type('Address1')
  cy.get(selectors.eventCreate.addressLine2).type('Address2')
  cy.get(selectors.eventCreate.addressTown).type('Campinas')
  cy.get(selectors.eventCreate.addressCountry).select('Brazil')
  cy.get(selectors.eventCreate.service).select('Account Management : Northern Powerhouse')
  cy.get(selectors.eventCreate.organiser).click()
  cy.get(selectors.eventCreate.organiserInput)
    .type('Barry')
  cy.get(selectors.eventCreate.organiserOption)
    .should('be.visible')
  cy.get(selectors.eventCreate.organiserInput)
    .type('{enter}')
  cy.get(selectors.eventCreate.sharedYes).click()
  cy.get(selectors.eventCreate.relatedProgrammes).eq(0).select('CEN Energy')
  cy.get(selectors.eventCreate.addAnotherProgramme).click()
  cy.get(selectors.eventCreate.relatedProgrammes).eq(1).select('CEN Services')

  cy.get(selectors.eventCreate.saveEvent).click()

  cy.get(selectors.message.successful).should('contain', 'Event created')
}

describe('Event', () => {
  describe('create', () => {
    beforeEach(() => {
      cy.visit(events.create())
    })

    it('should throw validation messages for required fields', () => {
      cy.get(selectors.eventCreate.saveEvent).click()

      cy.get(selectors.eventCreate.nameError).should('contain', 'This field may not be blank.')
      cy.get(selectors.eventCreate.typeError).should('contain', 'This field may not be null.')
      cy.get(selectors.eventCreate.startDateError).should('contain', 'This field may not be null.')
      cy.get(selectors.eventCreate.endDateError).should('contain', 'This field may not be null.')
      cy.get(selectors.eventCreate.addressLine1Error).should('contain', 'This field may not be blank.')
      cy.get(selectors.eventCreate.addressTownError).should('contain', 'This field may not be blank.')
      cy.get(selectors.eventCreate.addressCountryError).should('contain', 'This field may not be null.')
      cy.get(selectors.eventCreate.serviceError).should('contain', 'This field may not be null.')
      cy.get(selectors.eventCreate.organiserError).should('contain', 'This field may not be null.')
    })

    it('should create an event successfully', () => {
      createEvent()
    })

    it('should create an attendee on a event', () => {
      createEvent()

      cy.visit(events.index())
      cy.contains('Eventful event').click()
      cy.contains('Attendees').click()
      cy.get(selectors.entityCollection.addAttendee).click()

      cy.get(selectors.nav.searchTerm).type('dean cox').type('{enter}')
      cy.get(selectors.collection.items).click()

      cy.get(selectors.message.successful)
        .should('contain', 'Event attendee added - This has created a service delivery record.')
        .and('contain', 'If required, you can view or edit the service delivery directly from the attendee record.')
    })
  })

  describe('edit', () => {
    before(() => {
      cy.visit(events.index())
    })

    it('should display newly created event in collection page', () => {
      cy.get(selectors.collection.items).should('contain', 'Eventful event')
    })

    it('should edit event type', () => {
      cy.get(selectors.collection.items).should('contain', 'Account management')
      cy.contains('Eventful event').click()
      cy.get(selectors.entityCollection.editEvent).click()
      cy.get(selectors.eventCreate.eventType).select('Exhibition')
      cy.get(selectors.eventCreate.saveAndReturn).click()

      assertKeyValueTable('bodyMainContent', {
        'Type of event': 'Exhibition',
      })
    })
  })
})
