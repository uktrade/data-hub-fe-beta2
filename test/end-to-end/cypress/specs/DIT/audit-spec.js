const { company, contact, investmentProject } = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

import { format } from 'date-fns'

const todaysDate = format(new Date(), 'd MMM yyyy')
let companyObj
let contactObj
let investmentProjectObj

describe('Company', () => {
  before(() => {
    companyObj = company.create.defaultCompany()
    cy.loadFixture([companyObj])
    cy.visit(urls.companies.edit(companyObj.pk))
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyEdit.website).clear().type('www.example.com')

    cy.get(selectors.companyEdit.saveButton).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.companies.editHistory.index(companyObj.pk))

    cy.get(selectors.editHistory.change(1).updated)
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')
    cy.get(selectors.companyEdit.history).should('contain', '1 change')
  })
})

describe('Contact', () => {
  before(() => {
    companyObj = company.create.defaultCompany()
    contactObj = contact.create(companyObj.pk)
    cy.loadFixture([companyObj])
    cy.loadFixture([contactObj])
    cy.visit(urls.contacts.edit(contactObj.pk))
  })

  it('should display name of the person who made contact record changes', () => {
    cy.get(selectors.contactCreate.save).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.contacts.audit(contactObj.pk))

    cy.get(selectors.collection.items)
      .should('contain', 'DIT Staff')
      .and('contain', 'No changes saved')
      .and('contain', todaysDate)
    cy.get(selectors.collection.header).should('contain', '1 result')
  })
})

describe('Investment Project', () => {
  before(() => {
    investmentProjectObj = investmentProject.create.newHotelFdi()
    cy.loadFixture([investmentProjectObj])
    cy.visit(urls.investments.projects.editDetails(investmentProjectObj.pk))
  })

  it('should display name of the person who made investment project record changes', () => {
    cy.get(selectors.investment.form.saveButton).click()
    cy.get(selectors.message.successful).should('be.visible')

    cy.visit(urls.investments.editHistory.index(investmentProjectObj.pk))

    cy.get(selectors.editHistory.change(1).updated)
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')

    cy.get(selectors.editHistory.change(1).noChanges).should(
      'have.text',
      'No changes were made to the project in this update'
    )
    cy.get(selectors.investment.form.history).should('contain', '1 change')
  })
})
