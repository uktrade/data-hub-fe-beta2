const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

const projectWithCompleteTeam = require('../../fixtures/investment/investment-complete-team.json')
const projectWithGlobalManager = require('../../fixtures/investment/investment-with-global-account-manager.json')

const investmentTeams = require('../../fixtures/investment/investment-teams.json')
const globalAccountManager = require('../../fixtures/investment/investment-global-manager.json')

const assertTable = ({ element, headings, rows }) => {
  cy.get(element)
    .as('table')
    .find('th')
    .each((el, i) => {
      cy.wrap(el).should('have.text', headings[i])
    })

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

const assertViewHeader = ({ project }) => {
  it('should render the header', () => {
    assertLocalHeader(project.name)
  })
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: '/investments',
      Projects: investments.projects.index(),
      [project.name]: investments.projects.project(project.id),
      'Project team': null,
    })
  })
}

describe('Viewing the team of a project', () => {
  context('When viewing a project with existing team data', () => {
    before(() => {
      cy.visit(investments.projects.details(projectWithCompleteTeam.id))
      cy.get('[data-test="project-team-link"]').click()
    })

    assertViewHeader({ project: projectWithCompleteTeam })

    it('should display expected data', () => {
      cy.get('[data-auto-id="client-relationship-management-heading"]').should(
        'have.text',
        'Client relationship management'
      )

      assertTable({
        element: '[data-auto-id="client-relationship-management-content"]',
        headings: ['Role', 'Adviser', 'Team'],
        rows: [
          [
            'Client Relationship Manager',
            projectWithCompleteTeam.client_relationship_manager.name,
            projectWithCompleteTeam.client_relationship_manager_team.name,
          ],
        ],
      })

      cy.get('[data-auto-id="project-management-heading"]').should(
        'have.text',
        'Project management'
      )

      assertTable({
        element: '[data-auto-id="project-management-content"]',
        headings: ['Role', 'Adviser', 'Team'],
        rows: [
          [
            'Project Assurance Adviser',
            projectWithCompleteTeam.project_assurance_adviser.name,
            projectWithCompleteTeam.project_assurance_team.name,
          ],
          [
            'Project Manager',
            projectWithCompleteTeam.project_manager.name,
            projectWithCompleteTeam.project_manager_team.name,
          ],
        ],
      })

      cy.get('[data-auto-id="project-specialist-team-members-heading"]').should(
        'have.text',
        'Project specialist and team members'
      )

      assertTable({
        element: '[data-auto-id="project-specialist-team-members-content"]',
        headings: ['Role', 'Adviser', 'Team'],
        rows: [
          [
            projectWithCompleteTeam.team_members[0].role,
            projectWithCompleteTeam.team_members[0].adviser.name,
            investmentTeams[projectWithCompleteTeam.team_members[0].adviser.id],
          ],
          [
            projectWithCompleteTeam.team_members[1].role,
            projectWithCompleteTeam.team_members[1].adviser.name,
            investmentTeams[projectWithCompleteTeam.team_members[1].adviser.id],
          ],
        ],
      })

      cy.get('[data-auto-id="success-verifier-heading"]').should(
        'have.text',
        'Success verifier'
      )

      cy.get('[data-auto-id="success-verifier-content"]').should(
        'have.text',
        'Will be assigned during "Verify win" stage.'
      )
    })
  })

  context('When viewing a project with a global account manager', () => {
    before(() => {
      cy.visit(investments.projects.details(projectWithGlobalManager.id))
      cy.get('[data-test="project-team-link"]').click()
    })

    assertViewHeader({ project: projectWithGlobalManager })

    it('should display expected data', () => {
      cy.get('[data-auto-id="client-relationship-management-heading"]').should(
        'have.text',
        'Client relationship management'
      )

      assertTable({
        element: '[data-auto-id="client-relationship-management-content"]',
        headings: ['Role', 'Adviser', 'Team'],
        rows: [
          [
            'Client Relationship Manager',
            projectWithGlobalManager.client_relationship_manager.name,
            projectWithGlobalManager.client_relationship_manager_team.name,
          ],
          [
            'Global Account Manager',
            globalAccountManager.name,
            globalAccountManager.dit_team.name,
          ],
        ],
      })
    })
  })

  context('When attempting to edit a non-existent project', () => {
    it('should display an error to the user', () => {
      cy.request({
        url: investments.projects.team('Error'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500)
      })
    })
  })
})
