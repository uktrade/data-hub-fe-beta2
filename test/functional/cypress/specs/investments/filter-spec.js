const selectTypeahead = (fieldName, input) =>
  cy.get(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

describe('Investments Collections Filter', () => {
  let filterIndicators
  beforeEach(() => {
    cy.get('aside button').next().as('adviserTypeaheadFilter')
    filterIndicators = () =>
      cy.get('main article button').as('filterIndicators')
  })
  context('when the url contains no state', () => {
    before(() => {
      cy.visit('/investments')
    })

    it('should filter by advisers', () => {
      cy.get('@adviserTypeaheadFilter')
        .should('contain', 'Search advisers')
        .find('label')
        .should('have.text', 'Advisers')

      selectTypeahead('#field-advisers', 'puck').should('contain', 'Puck Head')

      cy.url().should('contain', 'adviser')

      filterIndicators().should((el) => {
        expect(el).to.have.length(1)
        expect(el.text()).to.contain('Puck Head')
      })
    })

    it('should remove the filter advisers', () => {
      filterIndicators().click()
      filterIndicators().should((el) => {
        expect(el).to.have.length(0)
      })
      cy.get('@adviserTypeaheadFilter').should('contain', 'Search advisers')
    })
  })

  context('when the url is contains state', () => {
    before(() => {
      cy.visit(
        '/investments/projects/?adviser=e83a608e-84a4-11e6-ae22-56b6b6499611'
      )
      cy.get('aside button').next().as('adviserTypeaheadFilter')
    })
    it('should set the selected adviser filter', () => {
      cy.get('@adviserTypeaheadFilter').should('contain', 'Puck Head')
      filterIndicators().should((el) => {
        expect(el).to.have.length(1)
        expect(el.text()).to.contain('Puck Head')
      })
    })
  })
})

//   it('should filter by sector', () => {
//     const sector = selectors.filter.investments.sector
//     const { typeahead } = selectors.filter
//     cy.get(typeahead(sector).selectedOption)
//       .click()
//       .get(typeahead(sector).textInput)
//       .type('Advanced Engineering')
//       .get(typeahead(sector).options)
//       .should('have.length', 1)
//       .get(typeahead(sector).textInput)
//       .type('{enter}')
//       .type('{esc}')

//     cy.wait('@filterResults').then((xhr) => {
//       expect(xhr.url).to.contain(
//         'sector_descends=af959812-6095-e211-a939-e4115bead28a'
//       )
//     })
//   })

//   it('should filter by country', () => {
//     const country = selectors.filter.investments.country
//     const { typeahead } = selectors.filter

//     cy.get(typeahead(country).selectedOption)
//       .click()
//       .get(typeahead(country).textInput)
//       .type('United Kingdom')
//       .get(typeahead(country).options)
//       .should('have.length', 1)
//       .get(typeahead(country).textInput)
//       .type('{enter}')
//       .type('{esc}')

//     cy.wait('@filterResults').then((xhr) => {
//       expect(xhr.url).to.contain('country=80756b9a-5d95-e211-a939-e4115bead28a')
//     })
//   })

//   it('should filter by uk region', () => {
//     const { typeahead } = selectors.filter
//     const { ukRegion } = selectors.filter.investments
//     cy.get(typeahead(ukRegion).selectedOption)
//       .click()
//       .get(typeahead(ukRegion).textInput)
//       .type('North East')
//       .get(typeahead(ukRegion).options)
//       .should('have.length', 1)
//       .get(typeahead(ukRegion).textInput)
//       .type('{enter}')
//       .type('{esc}')

//     cy.wait('@filterResults').then((xhr) => {
//       expect(xhr.url).to.contain(
//         'uk_region_location=814cd12a-6095-e211-a939-e4115bead28a'
//       )
//     })

//     cy.get(selectors.entityCollection.entities)
//       .children()
//       .should('have.length', 2)
//   })
// })
