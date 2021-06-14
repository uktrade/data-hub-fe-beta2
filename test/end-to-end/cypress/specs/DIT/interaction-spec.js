const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

import { format } from 'date-fns'

const { companies, interactions } = require('../../../../../src/lib/urls')

const today = format(new Date(), 'd MMMM yyyy')

describe('Interaction', () => {
  const company = fixtures.company.create.defaultCompany('interaction testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
  })

  beforeEach(() => {
    cy.visit(
      companies.interactions.createType(company.pk, 'export', 'interaction')
    )
  })

  context('An interaction with no countries discussed', () => {
    it('should add the interaction', () => {
      const subject = 'Some interesting interaction'
      const formSelectors = selectors.interactionForm

      cy.get(formSelectors.service).select('Export Win')
      cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
      cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
      cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
        'Email/Website'
      )
      cy.get(formSelectors.subject).type(subject)
      cy.get(formSelectors.notes).type('Conversation with potential client')
      cy.get(formSelectors.policyFeedbackNo).click()
      cy.get(formSelectors.countriesDiscussed.no).click()
      cy.get(selectors.interactionForm.add).click()

      cy.contains('h1', subject)

      cy.visit(interactions.index())
      cy.get(selectors.filter.interaction.myInteractions).click()

      cy.get(selectors.collection.itemsHeader).should(
        'contain',
        'Some interesting interaction'
      )

      cy.get(selectors.collection.itemsList)
        .should('contain', 'Johnny Cakeman')
        .and('contain', 'Venus Ltd')
        .and(
          'contain',
          'DIT Staff, UKTI Team East Midlands - International Trade Team'
        )
        .and('contain', 'Export Win')
        .and('contain', today)
    })
  })

  context('An interaction where countries were discussed', () => {
    context('A unique country is added to each category', () => {
      it('should add the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export Win')
        cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        cy.get(formSelectors.countries.export).selectTypeaheadOption('Fran')
        cy.get(formSelectors.countries.future).selectTypeaheadOption('Germ')
        cy.get(formSelectors.countries.noInterest).selectTypeaheadOption('Spai')

        cy.get(selectors.interactionForm.add).click()

        cy.get('.table--key-value')
          .should('contain', 'Countries currently exporting toFrance')
          .and('contain', 'Future countries of interestGermany')
          .and('contain', 'Countries not interested inSpain')

        cy.visit(companies.exports.index(company.pk))

        cy.contains('Export countries information')
          .parent()
          .should('contain', 'Currently exporting toFrance')
          .and('contain', 'Future countries of interestGermany')
          .and('contain', 'Countries of no interestSpain')
      })
    })

    context('The same country is added to two categories', () => {
      it('should get an error saving the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export Win')
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        cy.get(formSelectors.countries.export).selectTypeaheadOption('Fran')
        cy.get(formSelectors.countries.future).selectTypeaheadOption('Fran')

        cy.get(selectors.interactionForm.add).click()
        cy.contains(
          'A country that was discussed cannot be entered in multiple fields'
        )
      })
    })

    context('The no countries are added to any categories', () => {
      it('should get an error saving the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export Win')
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()

        cy.get(selectors.interactionForm.add).click()
        cy.contains('Select at least one country in one of the three fields')
      })
    })
  })
})

describe('Service delivery', () => {
  const company = fixtures.company.create.defaultCompany('interaction testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
  })

  beforeEach(() => {
    cy.visit(
      companies.interactions.createType(
        company.pk,
        'export',
        'service_delivery'
      )
    )
  })

  it('should create the service delivery', () => {
    const subject = 'Some interesting service delivery'

    const formSelectors = selectors.interactionForm

    cy.get(formSelectors.service).select('Export Win')
    cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
    cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
    cy.get(formSelectors.eventNo).click()
    cy.get(formSelectors.subject).type(subject)
    cy.get(formSelectors.notes).type('Conversation with potential client')
    cy.get(formSelectors.policyFeedbackNo).click()
    cy.get(formSelectors.countriesDiscussed.no).click()
    cy.get(selectors.interactionForm.add).click()

    cy.contains('h1', subject)
  })

  it('should display newly created service delivery', () => {
    cy.visit(interactions.index())
    cy.get(selectors.filter.interaction.myInteractions).click()

    cy.get(selectors.collection.itemsHeader).should(
      'contain',
      'Some interesting service delivery'
    )

    cy.get(selectors.collection.itemsList)
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'Venus Ltd')
      .and(
        'contain',
        'DIT Staff, UKTI Team East Midlands - International Trade Team'
      )
      .and('contain', 'Export Win')
      .and('contain', today)
  })
})
