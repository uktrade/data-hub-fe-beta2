import faker from 'faker'

const { companies, interactions } = require('../../../../../src/lib/urls')

import { investmentProjectFaker } from '../../fakers/investment-projects'
import { format } from 'date-fns'

const todayFormatted = format(new Date(), 'dd MMM yyyy')

describe('Dashboard - Investment details', () => {
  const investmentProject = investmentProjectFaker({
    sector: {
      name: 'Aerospace : Aircraft Design',
    },
    investor_company: {
      id: faker.datatype.uuid(),
      name: 'Foo Bar Baz',
    },
    latest_interaction: {
      id: faker.datatype.uuid(),
      date: new Date(),
      displayDate: todayFormatted,
      subject: 'A project interaction',
    },
    country_investment_originates_from: {
      id: faker.datatype.uuid(),
      name: 'Italy',
    },
  })

  const investmentProjects = [
    investmentProject,
    investmentProjectFaker({ country_investment_originates_from: undefined }),
    investmentProjectFaker({ latest_interaction: undefined }),
  ]
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: investmentProjects.length,
        results: investmentProjects,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-details"]').as('allInvestmentDetails')
    cy.get('[data-test="investment-details"]').eq(0).as('firstProjectDetails')
    cy.get('[data-test="investment-details"]').eq(1).as('secondProjectDetails')
    cy.get('[data-test="investment-details"]').eq(2).as('thirdProjectDetails')
    cy.get('@firstProjectDetails').find('dt').as('firstProjectTerms')
    cy.get('@firstProjectDetails').find('dd').as('firstProjectDescriptions')
    cy.get('@secondProjectDetails').find('dt').as('secondProjectTerms')
  })

  it('should have a details section for each project', () => {
    cy.get('@allInvestmentDetails').should(
      'have.length',
      investmentProjects.length
    )
  })

  it("should display 'Details' in a h3 header", () => {
    cy.get('@firstProjectDetails').find('h3').should('have.text', 'Details')
  })

  it('should display the investor details with a link to the investor', () => {
    cy.get('@firstProjectTerms').eq(0).should('have.text', 'Investor:')
    cy.get('@firstProjectDescriptions')
      .eq(0)
      .should('have.text', investmentProject.investor_company.name)
      .find('a')
      .should(
        'have.attr',
        'href',
        companies.details(investmentProject.investor_company.id)
      )
  })

  it('should display the sector details', () => {
    cy.get('@firstProjectTerms').eq(1).should('have.text', 'Sector:')
    cy.get('@firstProjectDescriptions')
      .eq(1)
      .should('have.text', investmentProject.sector.name)
  })

  it('should display the country of origin details', () => {
    cy.get('@firstProjectTerms').eq(2).should('have.text', 'Country of origin:')
    cy.get('@firstProjectDescriptions')
      .eq(2)
      .should(
        'have.text',
        investmentProject.country_investment_originates_from.name
      )
  })

  it('should display the date of the last interaction', () => {
    cy.get('@firstProjectTerms').eq(3).should('have.text', 'Last interaction:')
    cy.get('@firstProjectDescriptions')
      .eq(3)
      .should('have.text', investmentProject.latest_interaction.displayDate)
  })

  it('should display the last interaction subject with a link to the interaction', () => {
    cy.get('@firstProjectTerms')
      .eq(4)
      .should('have.text', 'Interaction subject:')
    cy.get('@firstProjectDescriptions')
      .eq(4)
      .should('have.text', investmentProject.latest_interaction.subject)
      .find('a')
      .should(
        'have.attr',
        'href',
        interactions.detail(investmentProject.latest_interaction.id)
      )
  })

  context("when a project doesn't have a country of origin", () => {
    it('should not contain a country of origin', () => {
      cy.get('@secondProjectTerms').should('not.contain', 'Country of origin')
    })
  })

  context("when a project doesn't have an interaction", () => {
    it('should not contain an interaction', () => {
      cy.get('@thirdProjectDetails')
        .should('not.contain', 'Last interaction')
        .get('@thirdProjectDetails')
        .should('not.contain', 'Interaction subject')
    })
  })
})
