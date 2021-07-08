const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertSummaryList,
} = require('../../support/assertions')

const DUNS_NUMBER_NOT_MATCHED = '111111111'
const DUNS_NUMBER_MATCHED = '222222222'

const companyLocalHeader = selectors.companyLocalHeader()

const performSearch = (companyName = 'some company') => {
  cy.get(selectors.companyMatch.find.companyNameInput).clear().type(companyName)
  cy.get(selectors.companyMatch.find.button).click()
}

describe('Match a company', () => {
  context('US company', () => {
    context('when viewing a US company', () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.usCompany.id))
      })

      it('should render the Data Hub record, including the state', () => {
        cy.contains('Data Hub business details (un-verified)')
          .should('match', 'h2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Texports Ltd',
              'Located at':
                '12 First Street, New York, 765413, Texas, United States',
            })
          )
      })
    })

    context(
      'when an unmatched US company from the search results is clicked',
      () => {
        before(() => {
          cy.visit(urls.companies.match.index(fixtures.company.usCompany.id))
          performSearch()
          cy.contains('Some unmatched US company').click()
        })

        it('should display the state', () => {
          cy.contains('Data Hub business details (un-verified)')
            .should('match', 'h2')
            .next()
            .find('dl')
            .then(($el) =>
              assertSummaryList($el, {
                'Company name': 'Texports Ltd',
                'Located at':
                  '12 First Street, New York, 765413, Texas, United States',
              })
            )
            .parent()
            .parent()
            .next()
            .should(
              'have.text',
              'Data Hub business details (after verification)'
            )
            .and('match', 'h2')
            .next()
            .find('dl')
            .then(($el) =>
              assertSummaryList($el, {
                'Company name': 'Some unmatched US company',
                'Located at':
                  '256 Square Street, Austin, 765413, Texas, United States',
              })
            )
        })
      }
    )

    context(`when "I still can't find what I'm looking for" is clicked`, () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.usCompany.id))
        performSearch()
        cy.contains("I can't find what I'm looking for").click()
        cy.contains("I still can't find what I'm looking for").click()
      })

      it('should contain the Data Hub record', () => {
        cy.contains('Data Hub business details (un-verified)')
          .should('match', 'h2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Texports Ltd',
              'Located at':
                '12 First Street, New York, 765413, Texas, United States',
            })
          )
      })
    })
  })

  context('when viewing "Search for verified business details" page', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Search for verified business details': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('Search for verified business details')
    })

    it('should render the Data Hub record', () => {
      cy.contains('Data Hub business details (un-verified)')
        .should('match', 'h2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Company name': 'Venus Ltd',
            'Located at': '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
          })
        )
    })

    it('should render both search input fields and a button', () => {
      cy.contains('Search third party supplier for business details')
        .and('match', 'h2')
        .next()
        .children()
        .first()
        .should('have.text', 'Company name')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .should('have.text', 'Company postcode (optional)')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .contains('Find company')
        .and('match', 'button')
    })

    it('should prepopulate company name and postcode text fields', () => {
      cy.get(selectors.companyMatch.find.companyNameInput).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.name
      )
      cy.get(selectors.companyMatch.find.postcodeField).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.address.postcode
      )
    })
  })

  context(
    'when the "Find company" button is clicked without providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      })

      it('should display error message', () => {
        cy.get(selectors.companyMatch.find.companyNameInput).clear()
        cy.get(selectors.companyMatch.find.button)
          .click()
          .get(selectors.companyMatch.form)
          .contains('Enter company name')
      })

      it('should not display the search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'not.exist'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'not.exist'
        )
      })
    }
  )

  context(
    'when the "Find company" button is clicked providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
      })

      it('should display the company search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'be.visible'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'be.visible'
        )
      })
    }
  )

  context(`when "I still can't find what I'm looking for" is clicked`, () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      performSearch()
      cy.contains("I can't find what I'm looking for").click()
      cy.contains("I still can't find what I'm looking for").click()
    })

    it('should redirect to the cannot find match page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.match.cannotFind(fixtures.company.venusLtd.id)
      )
    })

    it('should render the header', () => {
      assertLocalHeader('I still can’t find what I’m looking for')
      cy.get(selectors.localHeader().headingAfter).contains(
        'Add the company contact details below. It will be sent to our third party data supplier for verification.'
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.venusLtd.name]: urls.companies.detail(
          fixtures.company.venusLtd.id
        ),
        'Send business details': null,
      })
    })

    it('should contain the Data Hub record', () => {
      cy.contains('Data Hub business details (un-verified)')
        .should('match', 'h2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Company name': 'Venus Ltd',
            'Located at': '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
          })
        )
    })

    it('should render the rest of the page', () => {
      cy.contains('Company contact information')
        .and('match', 'h2')
        .next()
        .children()
        .should('have.length', 2)
        .first()
        .should('have.text', 'Website address')
        .next()
        .find('input')
        .should('have.attr', 'type', 'url')
        .parent()
        .parent()
        .next()
        .children()
        .should('have.length', 3)
        .first()
        .should('have.text', 'Phone number')
        .next()
        .should(
          'have.text',
          'If the name or address on the company website is different to what there is in Data Hub, please provide the phone number, so the company can be contacted.'
        )
        .next()
        .find('input')
        .should('have.attr', 'type', 'tel')
        .parent()
        .parent()
        .next()
        .should('have.text', 'What happens next')
        .and('match', 'h2')
        .next()
        .should('have.text', 'You don’t need to do anything else.')
        .next()
        .should(
          'have.text',
          'Our third-party supplier will verify the company’s business details directly, so make sure the details are correct and you have consent to share them.'
        )
        .next()
        .should(
          'have.text',
          'It will NOT change any recorded activity (interactions, OMIS orders or Investment projects).'
        )
        .next()
        .contains('Send')
        .and('match', 'button')
        .next()
        .contains('Back')
        .should(
          'have.attr',
          'href',
          urls.companies.match.index(fixtures.company.venusLtd.id)
        )
    })
  })

  context(
    `when the "Send" button is clicked without completing either field`,
    () => {
      before(() => {
        cy.visit(urls.companies.match.cannotFind(fixtures.company.venusLtd.id))
        cy.get('main button').click()
      })

      it('should display two error message', () => {
        cy.contains('Website address')
          .next()
          .children()
          .first()
          .should('have.text', 'Enter a website or phone number')

        cy.contains('Phone number')
          .next()
          .next()
          .children()
          .first()
          .should('have.text', 'Enter a website or phone number')

        cy.location('pathname').should(
          'eq',
          urls.companies.match.cannotFind(fixtures.company.venusLtd.id)
        )
      })
    }
  )

  context(
    `when the "Send" button is clicked after completing both fields`,
    () => {
      before(() => {
        cy.visit(urls.companies.match.cannotFind(fixtures.company.venusLtd.id))
      })

      it('should submit both fields', () => {
        cy.contains('Website address').next().find('input').type('01185673456')

        cy.contains('Phone number')
          .next()
          .next()
          .find('input')
          .type('http://wwww.google.com')

        cy.contains('button', 'Send').click()

        cy.location('pathname').should(
          'eq',
          urls.companies.activity.index(fixtures.company.venusLtd.id)
        )

        cy.get(companyLocalHeader.flashMessageList).contains(
          'Verification request sent for third party review'
        )
      })
    }
  )

  context(
    'when an unmatched company from the search results is clicked',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
        cy.contains('Some unmatched company').click()
      })

      it('should redirect to the the match confirmation page', () => {
        cy.location('pathname').should(
          'eq',
          urls.companies.match.confirmation(
            fixtures.company.venusLtd.id,
            DUNS_NUMBER_NOT_MATCHED
          )
        )
      })

      it('should render the header', () => {
        assertLocalHeader('Verify business details')
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.venusLtd.name]: urls.companies.detail(
            fixtures.company.venusLtd.id
          ),
          'Send request': null,
        })
      })

      it('should display matching confirmation details', () => {
        cy.contains('Data Hub business details (un-verified)')
          .should('match', 'h2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Venus Ltd',
              'Located at':
                '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
            })
          )
          .parent()
          .parent()
          .next()
          .should('have.text', 'Data Hub business details (after verification)')
          .and('match', 'h2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Some unmatched company',
              'Located at': '123 ABC Road, Brighton, BN2 9QB, United Kingdom',
            })
          )
          .parent()
          .parent()
          .next()
          .find('summary')
          .should('have.text', "Why can't I edit these details")
          .next()
          .should(
            'have.text',
            'These business details are from trusted third-party' +
              ' suppliers of verified company records. Being editable would make' +
              " them less reliable. If you think they're wrong, go back and select" +
              ' "I can\'t find what I\'m looking for".'
          )
          .parent()
          .next()
          .should('have.text', 'Verifying business details will:')
          .and('match', 'h2')
          .next()
          .children()
          .should('have.length', 2)
          .first()
          .should(
            'have.text',
            'NOT change any recorded activity (interactions, OMIS orders or Investment projects)'
          )
          .next()
          .should(
            'have.text',
            'ensure these business details are updated automatically in the future'
          )
          .parent()
          .next()
          .contains('Verify')
          .and('match', 'button')
          .next()
          .contains('Back')
          .should(
            'have.attr',
            'href',
            urls.companies.match.index(fixtures.company.venusLtd.id)
          )
      })
    }
  )

  context('when company matching is confirmed', () => {
    before(() => {
      cy.visit(
        urls.companies.match.confirmation(
          fixtures.company.venusLtd.id,
          DUNS_NUMBER_NOT_MATCHED
        )
      )

      cy.get('button:contains("Verify")').click()
    })

    it('should redirect to the company page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.activity.index(fixtures.company.venusLtd.id)
      )
    })

    it('displays the "Business details verified" flash message and the ID used in GA', () => {
      cy.get(companyLocalHeader.flashMessageList).contains(
        'Business details verified.Thanks for helping to improve ' +
          'the quality of records on Data Hub!'
      )
    })
  })

  context(
    'when an already matched company from the search results is clicked',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
        cy.contains('Some matched company').click()
      })

      it('should redirect to the the duplicated match page', () => {
        cy.location('pathname').should(
          'eq',
          urls.companies.match.confirmation(
            fixtures.company.venusLtd.id,
            DUNS_NUMBER_MATCHED
          )
        )
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.venusLtd.name]: urls.companies.detail(
            fixtures.company.venusLtd.id
          ),
          'Request merge': null,
        })
      })

      it('should render the header', () => {
        assertLocalHeader(
          'These verified business details are already being used to verify another Data Hub record'
        )
      })

      it('should display the content of the duplicate match page', () => {
        cy.contains(
          'This can happen when there are duplicate company records in Data Hub. To resolve this, you can ask the Support Team to merge these duplicates into one record.'
        )
          .next()
          .should('have.text', 'Requesting records merge will:')
          .and('match', 'h2')
          .next()
          .children()
          .should('have.length', 3)
          .first()
          .should(
            'have.text',
            'send a request to the Support Team to merge these records'
          )
          .next()
          .should(
            'have.text',
            'preserve all recorded activity (interactions, OMIS Orders' +
              ' and Investment Projects) and contacts from BOTH records and' +
              ' link them to the merged record'
          )
          .next()
          .should(
            'have.text',
            'ensure the business details are automatically updated in the future'
          )
          .parent()
          .next()
          .contains('Request merge')
          .and('match', 'button')
          .next()
          .contains('Back')
          .should(
            'have.attr',
            'href',
            urls.companies.match.index(fixtures.company.venusLtd.id)
          )
      })
    }
  )

  context('when company merge request is confirmed', () => {
    before(() => {
      cy.visit(
        urls.companies.match.confirmation(
          fixtures.company.venusLtd.id,
          DUNS_NUMBER_MATCHED
        )
      )
      cy.get('button:contains("Request merge")').click()
    })

    it('should redirect to the company page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.activity.index(fixtures.company.venusLtd.id)
      )
    })

    it('displays the "Company record update request sent" flash message', () => {
      cy.get(companyLocalHeader.flashMessageList).contains(
        'Company merge requested. Thanks for keeping Data Hub running smoothly.'
      )
    })
  })
})
