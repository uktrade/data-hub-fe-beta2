const urls = require('../../../../../src/lib/urls')

const expandToggleSections = () =>
  cy.get('[data-test="toggle-section-button"]').click({ multiple: true })

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
      expandToggleSections()
      cy.get(`[data-test="${selector}"]`).within((e) =>
        options.forEach((option) => cy.wrap(e).type(`${option}{enter}`))
      )
      cy.contains(
        `${expectedNumberOfResults} profile${
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

const testInputFilter = ({ selector, text, expectedNumberOfResults }) => {
  context(`When inputting text "${text}"`, () => {
    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.visit(urls.investments.profiles.index())
      expandToggleSections()
      cy.get(selector).within((e) => cy.wrap(e).type(text).blur())
      cy.contains(
        `${expectedNumberOfResults} profile${
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

const inputFilterTestCases = ({ filterName, selector, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testInputFilter({
        selector,
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
    filterName: 'Sector of interest',
    selector: 'asset-class-filter',
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

  typeaheadFilterTestCases({
    filterName: 'Check clearance',
    selector: 'required-checks-conducted-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Cleared'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Issues identified'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Cleared', 'Issues identified'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Company name',
    selector: '[placeholder="Search company name"]',
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

  inputFilterTestCases({
    filterName: 'Investable capital £ min',
    selector: '[aria-label="Investable capital £ min"]',
    cases: [
      {
        text: '1000',
        expectedNumberOfResults: 3,
      },
      {
        text: '1001',
        expectedNumberOfResults: 2,
      },
      {
        text: '2001',
        expectedNumberOfResults: 1,
      },
      {
        text: '3001',
        expectedNumberOfResults: 0,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Investable capital £ max',
    selector: '[aria-label="Investable capital £ max"]',
    cases: [
      {
        text: '999',
        expectedNumberOfResults: 0,
      },
      {
        text: '1000',
        expectedNumberOfResults: 1,
      },
      {
        text: '2000',
        expectedNumberOfResults: 2,
      },
      {
        text: '3000',
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Global assets under management £ min',
    selector: '[aria-label="Global assets under management £ min"]',
    cases: [
      {
        text: '1000',
        expectedNumberOfResults: 3,
      },
      {
        text: '1001',
        expectedNumberOfResults: 2,
      },
      {
        text: '2001',
        expectedNumberOfResults: 1,
      },
      {
        text: '3001',
        expectedNumberOfResults: 0,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Global assets under management £ max',
    selector: '[aria-label="Global assets under management £ max"]',
    cases: [
      {
        text: '999',
        expectedNumberOfResults: 0,
      },
      {
        text: '1000',
        expectedNumberOfResults: 1,
      },
      {
        text: '2000',
        expectedNumberOfResults: 2,
      },
      {
        text: '3000',
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Deal ticket size',
    selector: 'deal-ticket-size-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Up to £49 million'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['£50-99 million'],
        expectedNumberOfResults: 4,
      },
      {
        options: ['Up to £49 million', '£50-99 million'],
        expectedNumberOfResults: 5,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Investment type',
    selector: 'types-of-investment-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Direct Investment in Project Equity'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Venture capital funds'],
        expectedNumberOfResults: 2,
      },
      {
        options: [
          'Direct Investment in Project Equity',
          'Venture capital funds',
        ],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Minimum return rate',
    selector: 'minimum-return-rate-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['5-10%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['10-15%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['5-10%', '10-15%'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Time horizon',
    selector: 'time-horizon-tenor-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Up to 5 years'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['15 years +'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Up to 5 years', '15 years +'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Restrictions and conditions',
    selector: 'restrictions-conditions-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Require board seat'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Inflation adjustment'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Require board seat', 'Inflation adjustment'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Construction risk',
    selector: 'construction-risk-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Greenfield (construction risk)'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Brownfield (some construction risk)'],
        expectedNumberOfResults: 2,
      },
      {
        options: [
          'Greenfield (construction risk)',
          'Brownfield (some construction risk)',
        ],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Minimum equity percentage',
    selector: 'minimum-equity-percentage-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['1-19%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['50% +'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['1-19%', '50% +'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Desired deal role',
    selector: 'desired-deal-role-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Lead manager / deal structure'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Co-lead manager'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Lead manager / deal structure', 'Co-lead manager'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'UK regions of interest',
    selector: 'uk-regions-of-interest',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Benzonia'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Benzonia', 'Jersey'],
        expectedNumberOfResults: 3,
      },
      {
        options: ['Jersey'],
        expectedNumberOfResults: 2,
      },
    ],
  })
})
