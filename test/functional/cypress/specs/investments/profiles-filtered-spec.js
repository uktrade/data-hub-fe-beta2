const urls = require('../../../../../src/lib/urls')

const testTypeaheadFilter = ({
  selector,
  options = [],
  expectedNumberOfResults,
}) => {
  const optionsMessage = options.length
    ? `options ${options.join(', ')}`
    : `no options`

  context(`When ${optionsMessage} are selected`, () => {
    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.visit(urls.investments.profiles.index())
      cy.get(`[data-test="${selector}"]`).within((e) =>
        options.forEach((option) => cy.wrap(e).type(`${option}{enter}`))
      )
      cy.contains(
        `${expectedNumberOfResults} Profile${
          expectedNumberOfResults > 1 ? 's' : ''
        }`
      )
      cy.get('h3').should('have.length', expectedNumberOfResults)
    })

    it('A chip should appear for each selected filter in the header', () =>
      cy
        .get('#filter-chips')
        .within((e) =>
          options.forEach((option) => cy.wrap(e).contains(option))
        ))
  })
}

const testInputFilter = ({ placeholder, text, expectedNumberOfResults }) => {
  context(`When inputting text "${text}"`, () => {
    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.visit(urls.investments.profiles.index())
      cy.get(`[placeholder="${placeholder}"]`).within((e) =>
        cy.wrap(e).type(text).blur()
      )
      cy.contains(
        `${expectedNumberOfResults} Profile${
          expectedNumberOfResults > 1 ? 's' : ''
        }`
      )
      cy.get('h3').should('have.length', expectedNumberOfResults)
    })

    it('A chip should appear for the selected filter in the header', () =>
      cy.get('#filter-chips').within((e) => cy.wrap(e).contains(text)))
  })
}

const typeaheadFilterTestCases = ({ filterName, selector, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testTypeaheadFilter({
        selector,
        ...options,
      })
    )
  )

const inputFilterTestCases = ({ filterName, placeholder, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testInputFilter({
        placeholder,
        ...options,
      })
    )
  )

describe('Investor profiles filters', () => {
  typeaheadFilterTestCases({
    filterName: 'Country of origin',
    selector: 'country-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Afghanistan'],
        expectedNumberOfResults: 3,
      },
      {
        options: ['Zimbabwe'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Slovakia'],
        expectedNumberOfResults: 0,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Asset class of interest',
    selector: 'asset-class-of-interest-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Biofuel'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Nuclear'],
        expectedNumberOfResults: 3,
      },
      {
        options: ['Biofuel', 'Nuclear'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Investor type',
    selector: 'investor-type-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Fund of funds'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Family office'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Fund of funds', 'Family office'],
        expectedNumberOfResults: 2,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Company name',
    placeholder: 'Search company name',
    cases: [
      {
        text: 'foo',
        expectedNumberOfResults: 2,
      },
      {
        text: 'bar',
        expectedNumberOfResults: 1,
      },
      {
        text: 'bing',
        expectedNumberOfResults: 0,
      },
    ],
  })
})
