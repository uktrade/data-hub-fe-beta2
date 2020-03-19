const fixtures = require('../../fixtures')
const {
  companies,
  contacts,
  events,
  interactions,
  omis,
  search,
  investments,
} = require('../../../../../src/lib/urls')

const { assertError } = require('../../support/assertions')

describe('LEP Permission', () => {
  describe('companies', () => {
    describe('orders', () => {
      before(() => {
        cy.visit(companies.orders(fixtures.company.lambdaPlc.id), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('exports', () => {
      before(() => {
        cy.visit(companies.exports.index(fixtures.company.lambdaPlc.id), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit(events.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit(interactions.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  describe('omis', () => {
    before(() => {
      cy.visit(omis.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  context('search', () => {
    describe('interaction', () => {
      before(() => {
        cy.visit(search.type('interactions'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('event', () => {
      before(() => {
        cy.visit(search.type('events'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('omis', () => {
      before(() => {
        cy.visit(search.type('omis'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('investment', () => {
    describe('investment document', () => {
      before(() => {
        cy.visit(
          investments.projects.documents(fixtures.investmentProject.newZoo.id),
          {
            failOnStatusCode: false,
          }
        )
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit(
          investments.projects.interactionCollection(
            fixtures.investmentProject.newGolfCourse.id
          ),
          {
            failOnStatusCode: false,
          }
        )
      })

      it("should prevent LEP users from accessing an interaction they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit(
          investments.projects.team(
            fixtures.investmentProject.fancyDressManufacturing.id
          ),
          {
            failOnStatusCode: false,
          }
        )
      })

      it("should prevent LEP users from accessing a team they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      before(() => {
        cy.visit(contacts.documents(fixtures.contact.johnnyCakeman.id), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interactions', () => {
      before(() => {
        cy.visit(
          contacts.contactInteractions(fixtures.contact.johnnyCakeman.id),
          { failOnStatusCode: false }
        )
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })
})
