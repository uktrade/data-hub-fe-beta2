const selectors = require('../../../../selectors')
const { testBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { companies, dashboard } = require('../../../../../src/lib/urls')

describe('Local header for global ultimate company', () => {
  context('when visting a global ultimate company activity page', () => {
    before(() => {
      cy.visit(companies.activity.index(fixtures.company.dnbGlobalUltimate.id))
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        'Activity Feed': null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(fixtures.company.dnbGlobalUltimate.id)}`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company contacts page', () => {
    before(() => {
      cy.visit(companies.contacts(fixtures.company.dnbGlobalUltimate.id))
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        Contacts: null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/contacts?sortby=modified_on%3Adesc&archived=false`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company core team page', () => {
    before(() => {
      cy.visit(companies.advisers.index(fixtures.company.dnbGlobalUltimate.id))
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        'Core Team': null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/advisers`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context(
    'when visting a global ultimate company investment projects page',
    () => {
      before(() => {
        cy.visit(
          companies.investments.companyInvestment(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      })

      it('should correctly display the breadcrumbs', () => {
        testBreadcrumbs({
          Home: dashboard(),
          Companies: companies.index(),
          'DnB Global Ultimate': companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          ),
          Investment: null,
        })
      })

      it('should display the company name', () => {
        cy.get(selectors.companyLocalHeader().companyName).contains(
          fixtures.company.dnbGlobalUltimate.name
        )
      })

      it('should display the company address', () => {
        cy.get(selectors.companyLocalHeader().address).contains(
          '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.dnbGlobalUltimate.id
          )}?returnUrl=${companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          )}/investments/projects`
        )
      })

      it('should display an "Ultimate HQ" badge', () => {
        cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
      })

      it('should display an "What does this mean?" details', () => {
        cy.get(selectors.companyLocalHeader().metaList)
          .should('contain', 'What does this mean?')
          .should(
            'contain',
            'This HQ is in control of all related company records for DnB Global Ultimate'
          )
      })

      it('should display the correct description', () => {
        cy.get(selectors.companyLocalHeader().description.paragraph(1))
          .contains(
            'Data Hub contains 2 other company records related to this company'
          )
          .contains('2 other company records')
          .should(
            'have.attr',
            'href',
            companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
          )
        cy.get(
          selectors.companyLocalHeader().description.paragraph(2)
        ).contains(
          'This is an account managed company (One List Tier A - Strategic Account)'
        )
        cy.get(selectors.companyLocalHeader().description.paragraph(3))
          .contains('Global Account Manager: Travis Greene View core team')
          .contains('View core team')
          .should(
            'have.attr',
            'href',
            companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
          )
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })
    }
  )
  context(
    'when visting a global ultimate company investment large capital page',
    () => {
      before(() => {
        cy.visit(
          companies.investments.largeCapitalProfile(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      })

      it('should correctly display the breadcrumbs', () => {
        testBreadcrumbs({
          Home: dashboard(),
          Companies: companies.index(),
          'DnB Global Ultimate': companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          ),
          Investment: null,
        })
      })

      it('should display the company name', () => {
        cy.get(selectors.companyLocalHeader().companyName).contains(
          fixtures.company.dnbGlobalUltimate.name
        )
      })

      it('should display the company address', () => {
        cy.get(selectors.companyLocalHeader().address).contains(
          '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.dnbGlobalUltimate.id
          )}?returnUrl=${companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          )}/investments/large-capital-profile`
        )
      })

      it('should display an "Ultimate HQ" badge', () => {
        cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
      })

      it('should display an "What does this mean?" details', () => {
        cy.get(selectors.companyLocalHeader().metaList)
          .should('contain', 'What does this mean?')
          .should(
            'contain',
            'This HQ is in control of all related company records for DnB Global Ultimate'
          )
      })

      it('should display the correct description', () => {
        cy.get(selectors.companyLocalHeader().description.paragraph(1))
          .contains(
            'Data Hub contains 2 other company records related to this company'
          )
          .contains('2 other company records')
          .should(
            'have.attr',
            'href',
            companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
          )
        cy.get(
          selectors.companyLocalHeader().description.paragraph(2)
        ).contains(
          'This is an account managed company (One List Tier A - Strategic Account)'
        )
        cy.get(selectors.companyLocalHeader().description.paragraph(3))
          .contains('Global Account Manager: Travis Greene View core team')
          .contains('View core team')
          .should(
            'have.attr',
            'href',
            companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
          )
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })
    }
  )
  context('when visting a global ultimate company export page', () => {
    before(() => {
      cy.visit(companies.exports.index(fixtures.company.dnbGlobalUltimate.id))
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        Exports: null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/exports`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company export history page', () => {
    before(() => {
      cy.visit(
        companies.exports.history.index(fixtures.company.dnbGlobalUltimate.id)
      )
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        Exports: companies.exports.history.index(
          fixtures.company.dnbGlobalUltimate.id
        ),
        'Export countries history': null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/exports/history`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company orders page', () => {
    before(() => {
      cy.visit(companies.orders(fixtures.company.dnbGlobalUltimate.id))
    })

    it('should correctly display the breadcrumbs', () => {
      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        'DnB Global Ultimate': companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        'Orders (OMIS)': null,
      })
    })

    it('should display the company name', () => {
      cy.get(selectors.companyLocalHeader().companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
      )
    })

    it('should display the company address', () => {
      cy.get(selectors.companyLocalHeader().address).contains(
        '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/orders`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.companyLocalHeader().badge).contains('Ultimate HQ')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.companyLocalHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(selectors.companyLocalHeader().description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          companies.dnbHierarchy.index(fixtures.company.dnbGlobalUltimate.id)
        )
      cy.get(selectors.companyLocalHeader().description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(selectors.companyLocalHeader().description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })

  // context('when visting a company under DnB investigation', () => {})
})
