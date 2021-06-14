const { investments } = require('../../../../../src/lib/urls')

describe('Dashboard - Investment project next steps', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-steps"]').as('nexSteps')
    cy.get('[data-test="project-details"]').eq(0).as('firstProjectDetails')
    cy.get('[data-test="investment-steps"]').eq(0).as('moreThanThreeSteps')
    cy.get('[data-test="investment-steps"]').eq(1).as('lessThanThreeSteps')
    cy.get('[data-test="investment-steps"]').eq(2).as('oneAdditionalStep')
    cy.get('[data-test="investment-steps"]').eq(7).as('oneStep')
  })

  it('should contain next steps for all list items', () => {
    cy.get('@nexSteps').should('have.length', 9)
  })

  context('when I have no steps to complete', () => {
    it('should not show next steps', () => {
      cy.get('@firstProjectDetails')
        .find('[data-test="investment-steps"]')
        .should('not.have.exist')
    })
  })

  context('when I have one step to complete', () => {
    it('should show a title', () => {
      cy.get('@oneStep').find('h3').should('have.text', 'Next step')
    })
    it('should show one list item', () => {
      cy.get('@oneStep').find('ul li').should('have.length', 1)
    })
    it('should say that you have one additional step to action', () => {
      cy.get('@oneStep')
        .find('ul li')
        .eq(0)
        .should(
          'have.text',
          'Includes capital, operational and R&D expenditure'
        )
    })
    it('should display a link to the project details page', () => {
      cy.get('@oneStep')
        .find('a')
        .should('have.text', 'Add details to move to Won stage')
        .should(
          'have.attr',
          'href',
          investments.projects.details('ea3a03ba-b239-4956-b2fb-f35c91109674')
        )
    })
  })

  context('when I have less than 3 steps to complete', () => {
    it('should show a title', () => {
      cy.get('@lessThanThreeSteps').find('h3').should('have.text', 'Next steps')
    })
    it('should show two list items', () => {
      cy.get('@lessThanThreeSteps').find('ul li').should('have.length', 2)
    })
    it('should say that you have additional steps to action', () => {
      cy.get('@lessThanThreeSteps')
        .find('ul li')
        .eq(0)
        .should(
          'have.text',
          'Includes capital, operational and R&D expenditure'
        )
        .next()
        .should('have.text', 'Number of new jobs')
    })
    it('should display a link to the project details page', () => {
      cy.get('@lessThanThreeSteps')
        .find('a')
        .should('have.text', 'Add details to move to Verify win stage')
        .should(
          'have.attr',
          'href',
          investments.projects.details('0e686ea4-b8a2-4337-aec4-114d92ad4588')
        )
    })
  })
  context('when I have more than 3 steps to complete', () => {
    it('should show a title', () => {
      cy.get('@moreThanThreeSteps').find('h3').should('have.text', 'Next steps')
    })
    it('should show three list items', () => {
      cy.get('@moreThanThreeSteps').find('ul li').should('have.length', 4)
    })
    it('should say that you have additional steps to action', () => {
      cy.get('@moreThanThreeSteps')
        .find('ul li')
        .should(
          'have.text',
          'Actual land dateAverage salary of new jobsCan client provide capital expenditure value?Plus 23 additional fields'
        )
    })
    it('should display a link to the project details page', () => {
      cy.get('@moreThanThreeSteps')
        .find('a')
        .should('have.text', 'Add details to move to Assign PM stage')
        .should(
          'have.attr',
          'href',
          investments.projects.details('b30dee70-b2d6-48cf-9ce4-b9264854470c')
        )
    })
  })
  context('when I have 3 steps and only 1 addtional step', () => {
    it('should show a title', () => {
      cy.get('@oneAdditionalStep').find('h3').should('have.text', 'Next steps')
    })
    it('should show three list items', () => {
      cy.get('@oneAdditionalStep').find('ul li').should('have.length', 4)
    })
    it('should say that you have additional steps to action', () => {
      cy.get('@oneAdditionalStep')
        .find('ul li')
        .should(
          'have.text',
          'Client requirementsIncludes capital, operational and R&D expenditureNumber of new jobsPlus 1 additional field'
        )
    })
    it('should display a link to the project details page', () => {
      cy.get('@oneAdditionalStep')
        .find('a')
        .should('have.text', 'Add details to move to Verify win stage')
        .should(
          'have.attr',
          'href',
          investments.projects.details('18750b26-a8c3-41b2-8d3a-fb0b930c2270')
        )
    })
  })
})
