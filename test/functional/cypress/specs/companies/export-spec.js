const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const exportSelectors = require('../../../../selectors/company/export')

describe('Companies Export', () => {
  context('when viewing exports for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/exports`)
    })

    it('should not display the "Add export" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .export.editButton(fixtures.company.oneListCorp.id)
      ).should('not.exist')
    })
  })
})

describe('Companies Export Countries', () => {
  const countrySelectors = exportSelectors.countries

  context('when there is some history', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/exports/countries`)
    })

    it('renders the history', () => {
      cy.get(countrySelectors.tabHeading).contains('Export markets history')
    })

    it('renders the collection list with the correct results', () => {
      cy.get(countrySelectors.resultsHeading).contains('4 results')
      const listHeadings = cy.get(countrySelectors.listItemHeadings)
      const headingText = [
        'My interaction subject here',
        'France, China added to future countries of interest',
        'Madagascar, Kenya removed from currently exporting',
        'Argentina, Greenland, Zimbabwe removed from countries of no interest',
      ]
      listHeadings.should('have.length', 4)
      listHeadings.each(($el, index) => {
        expect($el).to.contain(headingText[index])
      })
    })
  })
})
