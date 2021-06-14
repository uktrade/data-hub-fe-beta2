const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const { assertBreadcrumbs } = require('../../../support/assertions')
const exportSelectors = require('../../../../../selectors/company/export')

const countrySelectors = exportSelectors.countries

describe('Company Export tab - Export countries history', () => {
  function checkListItems(items) {
    items.forEach(([text, by, date]) => {
      cy.contains(text).siblings().should('contain', by).should('contain', date)
    })
  }

  function visitHistory(companyId) {
    cy.intercept('POST', '**/export-country-history').as('exportHistoryResults')
    cy.visit(urls.companies.exports.history.index(companyId))
    cy.wait('@exportHistoryResults')
  }

  describe('Full history', () => {
    context('when there is no history', () => {
      before(() => {
        visitHistory(fixtures.company.lambdaPlc.id)
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.lambdaPlc.name]: urls.companies.detail(
            fixtures.company.lambdaPlc.id
          ),
          Exports: urls.companies.exports.index(fixtures.company.lambdaPlc.id),
          'Export countries history': null,
        })
      })

      it('renders the help message', () => {
        cy.contains(
          'You can only see the history of countries that were added or edited after 6th February 2020'
        )
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with the 0 results', () => {
        cy.contains('0 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 0)
      })
    })

    context('when there is history with multiple pages', () => {
      before(() => {
        visitHistory(fixtures.company.dnbCorp.id)
      })

      it('renders the help message', () => {
        cy.contains(
          'You can only see the history of countries that were added or edited after 6th February 2020'
        )
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with 10 of the 12 results', () => {
        cy.contains('12 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 10)

        checkListItems([
          [
            'Belarus added to countries of no interest',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Botswana added to future countries of interest',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Georgia added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:48am',
          ],
          [
            'France added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:47am',
          ],
          [
            'Fiji added to currently exporting',
            'By DIT Staff',
            'Date 11 Feb 2020, 10:46am',
          ],
          [
            'Argentina added to currently exporting',
            'By DIT Staff',
            'Date 6 Feb 2020, 4:06pm',
          ],
          [
            'Andorra added to currently exporting',
            'By DIT Staff',
            'Date 6 Feb 2020, 4:05pm',
          ],
          [
            'Afghanistan added to future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:42pm',
          ],
          [
            'Andorra removed from future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
          [
            'Angola added to countries of no interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })

      it('should display the next button', () => {
        cy.get('#company-export-full-history').within(() => {
          cy.get('ul:last li a:last').should('have.text', 'Next')
        })
      })

      it('should not display the previous button', () => {
        cy.get('#company-export-full-history').within(() => {
          cy.get('ul:last li a:first').should('not.have.text', 'Previous')
        })
      })

      it('the second page renders the collection list with 2 of the 12 results', () => {
        cy.get('a').contains('2').click()
        cy.get(countrySelectors.listItemHeadings).should('have.length', 2)

        checkListItems([
          [
            'Andorra removed from future countries of interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
          [
            'Angola added to countries of no interest',
            'By DIT Staff',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })

      it('should not display the next button', () => {
        cy.get('#company-export-full-history').within(() => {
          cy.get('ul:last li a:last').should('not.have.text', 'Next')
        })
      })

      it('should display the previous button', () => {
        cy.get('#company-export-full-history').within(() => {
          cy.get('ul:last li a:first').should('have.text', 'Previous')
        })
      })
    })

    context('when there is history that can be grouped', () => {
      before(() => {
        visitHistory(fixtures.company.dnbGlobalUltimate.id)
      })

      it('renders the help message', () => {
        cy.contains(
          'You can only see the history of countries that were added or edited after 6th February 2020'
        )
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with grouped countries in alphabetical order', () => {
        cy.contains('10 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 10)

        checkListItems([
          [
            'Afghanistan, Bahrain, Bangladesh, Barbados added to countries of no interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'France removed from future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'Spain added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 4:33pm',
          ],
          [
            'Albania, Brazil, Gibraltar removed from currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'France added to future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'Albania, Brazil, Gibraltar added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:55am',
          ],
          [
            'Germany, Spain removed from future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'France removed from currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'Germany, Spain added to future countries of interest',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:54am',
          ],
          [
            'France added to currently exporting',
            'By Stephan Padberg',
            'Date 4 Mar 2020, 8:53am',
          ],
        ])
      })

      it('should not display the pagination', () => {
        cy.get('#company-export-full-history ul').should('not.exist')
      })
    })

    context('when the user is unknown', () => {
      context('With a single history item', () => {
        before(() => {
          visitHistory(fixtures.company.marsExportsLtd.id)
        })

        it('renders the help message', () => {
          cy.contains(
            'You can only see the history of countries that were added or edited after 6th February 2020'
          )
        })

        it('renders the title', () => {
          cy.contains('Export countries history')
        })

        it('renders the collection list with the one result', () => {
          cy.contains('1 result')
          cy.get(countrySelectors.listItemHeadings).should('have.length', 1)

          checkListItems([
            [
              'Andorra removed from future countries of interest',
              'By unknown',
              'Date 6 Feb 2020, 3:41pm',
            ],
          ])
        })
      })

      context('With grouped history items', () => {
        before(() => {
          visitHistory(fixtures.company.minimallyMinimalLtd.id)
        })

        it('renders the help message', () => {
          cy.contains(
            'You can only see the history of countries that were added or edited after 6th February 2020'
          )
        })

        it('renders the title', () => {
          cy.contains('Export countries history')
        })

        it('renders the collection list with grouped countries in alphabetical order', () => {
          cy.contains('4 results')
          cy.get(countrySelectors.listItemHeadings).should('have.length', 4)

          checkListItems([
            [
              'Gibraltar, Maldives added to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Angola moved to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Andorra added to currently exporting',
              'By unknown',
              'Date 6 Feb 2020, 5:07pm',
            ],
            [
              'Angola, Czechia, Hong Kong, Kiribati added to future countries of interest',
              'By unknown',
              'Date 6 Feb 2020, 5:06pm',
            ],
          ])
        })
      })
    })

    context('when the only item is an "update" item', () => {
      before(() => {
        visitHistory(fixtures.company.dnbSubsidiary.id)
      })

      it('should not filter out the update', () => {
        cy.get(countrySelectors.listItemHeadings).should('have.length', 1)
        checkListItems([
          [
            'Andorra moved to future countries of interest',
            'By unknown',
            'Date 6 Feb 2020, 3:41pm',
          ],
        ])
      })
    })

    context('when viewing a company with interactions in the history', () => {
      before(() => {
        visitHistory(fixtures.company.investigationLimited.id)
      })

      it('renders the help message', () => {
        cy.contains(
          'You can only see the history of countries that were added or edited after 6th February 2020'
        )
      })

      it('renders the title', () => {
        cy.contains('Export countries history')
      })

      it('renders the collection list with 5 results', () => {
        const historyItems = fixtures.export.historyWithInteractions.results

        function checkInteraction(assertions, index) {
          const item = historyItems[index]
          const interaction = 'interaction' + index
          const link = 'interactionLink' + index
          const subHeading = 'interactionSubHeading' + index
          const assertionTasks = []

          assertions.forEach(([assertion, values]) => {
            values.forEach((value) => {
              assertionTasks.push({ assertion, value })
            })
          })

          cy.contains(item.subject)
            .as(link)
            .parent()
            .siblings('h4')
            .as(subHeading)
            .parent()
            .as(interaction)

          cy.get('@' + link).should(
            'have.attr',
            'href',
            urls.interactions.detail(item.id)
          )

          cy.get('@' + interaction)
            .find('div span')
            .should('contain', 'Interaction')

          assertionTasks.reduce(($details, { assertion, value }) => {
            return $details.should(assertion, value)
          }, cy.get('@' + interaction).find('details'))
        }

        cy.contains('5 results')
        cy.get(countrySelectors.listItemHeadings).should('have.length', 5)

        const interactionDetails = [
          [
            [
              'contain',
              [
                'Company contacts Stephan Padberg, Stephanie Stokes',
                'Advisers Mr. Genesis Kub (et nihil repudiandae), Solon Lynch (ea est totam), Dr. Meda Mraz (fuga corporis architecto)',
                'Service Deserunt magni sapiente soluta praesentium sapiente.',
                'Countries currently exporting to Benin',
                'Future countries of interest Brunei Darussalam, French Polynesia',
              ],
            ],
            ['not.contain', ['Countries not interested in']],
          ],
          [
            [
              'contain',
              [
                'Company contact Justus Simonis',
                'Adviser Carolanne Langworth (sit delectus recusandae)',
                'Service Ipsa dicta omnis pariatur.',
                'Countries currently exporting to Christmas Island, Indonesia, Martinique',
                'Countries not interested in Serbia',
              ],
            ],
            ['not.contain', ['Future countries of interest']],
          ],
          [
            [
              'contain',
              [
                'Company contacts Karen Mayer Jr., Ari Von',
                'Adviser Horace Orn (nisi ipsa quisquam)',
                'Service Architecto suscipit et aliquam architecto.',
                'Countries currently exporting to Burkina Faso',
                'Future countries of interest Kyrgyz Republic, Trinidad and Tobago',
              ],
            ],
            ['not.contain', ['Countries not interested in']],
          ],
          [
            [
              'contain',
              [
                'Company contact Leonie Deckow',
                'Advisers Napoleon Powlowski (veritatis temporibus unde), Giovanna Anderson (delectus repellendus ducimus), Tessie Hane (perferendis nihil nam)',
                'Service Repellat quia fugiat velit delectus expedita omnis doloribus.',
                'Countries currently exporting to Bolivia, Cameroon',
                'Future countries of interest Bolivia, Qatar',
                'Countries not interested in Australia, Greenland',
              ],
            ],
          ],
        ]

        interactionDetails.forEach(checkInteraction)

        cy.get('@interactionSubHeading0').should(
          'contain',
          'Created 8 Jun 2019, 7:24am'
        )
        cy.get('@interactionSubHeading1').should(
          'contain',
          'Created 21 Jun 2019, 5:07am'
        )
        cy.get('@interactionSubHeading2').should(
          'contain',
          'Created 17 Sep 2019, 12:13am'
        )
        cy.get('@interactionSubHeading3').should(
          'contain',
          'Created 5 Jan 2020, 1:27pm'
        )

        cy.contains('Belarus added to countries of no interest')
          .siblings()
          .should('contain', 'By DIT Staff')
          .should('contain', 'Date 11 Feb 2020, 10:47am')
      })
    })
  })

  describe('Country specific history', () => {
    function visitCountryHistory(companyId, countryId) {
      cy.intercept('POST', '**/export-country-history').as(
        'exportCountryHistoryResults'
      )
      cy.visit(urls.companies.exports.history.country(companyId, countryId))
      cy.wait('@exportCountryHistoryResults')
    }

    before(() => {
      visitCountryHistory(
        fixtures.company.dnbCorp.id,
        '975f66a0-5d95-e211-a939-e4115bead28a'
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbCorp.name]: urls.companies.detail(
          fixtures.company.dnbCorp.id
        ),
        Exports: urls.companies.exports.index(fixtures.company.dnbCorp.id),
        'Andorra exports history': null,
      })
    })

    it('renders the help message', () => {
      cy.contains(
        'You can only see the history of countries that were added or edited after 6th February 2020'
      )
    })

    it('renders the title', () => {
      cy.contains('Andorra exports history')
    })

    it('renders the collection list with 2 results', () => {
      cy.contains('2 results')
      cy.get(countrySelectors.listItemHeadings).should('have.length', 2)

      checkListItems([
        [
          'Andorra added to currently exporting',
          'By DIT Staff',
          'Date 6 Feb 2020, 4:06pm',
        ],
        [
          'Andorra removed from future countries of interest',
          'By DIT Staff',
          'Date 6 Feb 2020, 3:41pm',
        ],
      ])
    })
  })
})
