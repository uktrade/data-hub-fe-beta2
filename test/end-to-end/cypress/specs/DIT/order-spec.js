const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

import { format } from 'date-fns'

const { omis } = require('../../../../../src/lib/urls')

const today = format(new Date(), 'd MMM yyyy')

describe('Order', () => {
  const company = fixtures.company.create.defaultCompany('order testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
    cy.visit(omis.create(company.pk))
  })

  it('should create an order and view collection page', () => {
    cy.contains('Continue').click()
    cy.get(selectors.omisCreate.contact).select('Johnny Cakeman')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.country).select('Brazil')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.sectorNo).click()
    cy.get(selectors.omisCreate.sector).select('Aerospace')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.summary)
      .contains('Contact')
      .parent()
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'johnny@cakeman.com')
    cy.get(selectors.omisSummary.header)
      .should('contain', 'order testing')
      .and('contain', 'Brazil')
      .and('contain', today)

    cy.contains('Orders (OMIS)').click()

    cy.get(selectors.entityCollection.entityBadge(1)).should(
      'contain',
      'Brazil'
    )
    cy.get(selectors.collection.items)
      .should('contain', 'order testing')
      .and('contain', 'Johnny Cakeman')
      .and('contain', 'Aerospace')
  })
})
