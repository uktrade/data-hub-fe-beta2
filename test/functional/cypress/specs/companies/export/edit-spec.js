const minimallyMinimal = require('../../../../../sandbox/fixtures/v4/company/company-minimally-minimal.json')
const dnbLimited = require('../../../../../sandbox/fixtures/v4/company/company-dnb-ltd.json')
const urls = require('../../../../../../src/lib/urls')
const { assertFieldSelect } = require('../../../support/assertions')

describe('Company Export tab - Edit exports', () => {
  function assertReadOnlyItems(rows) {
    const DT_ALIAS = 'dt-items'
    const DD_ALIAS = 'dd-items'
    cy.get('dl').find('dt').as(DT_ALIAS).parent().find('dd').as(DD_ALIAS)
    rows.forEach((row, index) => {
      cy.get('@' + DT_ALIAS)
        .eq(index)
        .should('have.text', row.label)
      cy.get('@' + DD_ALIAS)
        .eq(index)
        .should('have.text', row.value)
    })
  }

  function assertButtons(companyId) {
    cy.contains('button', 'Save and return')
    cy.contains('a', 'Return without saving').should(
      'have.attr',
      'href',
      urls.companies.exports.index(companyId)
    )
  }

  function selectOption(selector, index) {
    cy.get(selector)
      .find('option')
      .then(($els) => $els.get(index).setAttribute('selected', 'selected'))
      .parent()
      .trigger('change')
  }

  context(
    'Without an existing export win category, great profile or export potential',
    () => {
      const XHR_ALIAS = 'save-export-edit-1'

      before(() => {
        cy.visit(urls.companies.exports.edit(minimallyMinimal.id))
      })

      beforeEach(() => {
        cy.intercept('PATCH', '*/v4/company/*').as(XHR_ALIAS)
      })

      it('Should render a list without a selected item', () => {
        cy.get('#field-export_experience_category').then((element) => {
          assertFieldSelect({
            element,
            label: 'Export win category (optional)',
            value: '-- Select category --',
            optionsCount: 7,
          })
        })
      })

      it('Should render the read only items', () => {
        assertReadOnlyItems([
          {
            label: 'great.gov.uk business profile',
            value: 'No profile',
          },
          { label: 'Export potential', value: 'No score given' },
        ])
      })

      it('Should render the buttons and clicking Save should save the value', () => {
        assertButtons(minimallyMinimal.id)

        //selecting a real value should send the UUID
        selectOption('#field-export_experience_category', 1)

        cy.contains('Save and return').click()

        cy.wait('@' + XHR_ALIAS).then((xhr) => {
          expect(xhr.response.url).to.contain(minimallyMinimal.id)
          expect(xhr.request.body.export_experience_category).to.equal(
            '73023b55-9568-4e3f-a134-53ec58451d3f'
          )
        })
      })
    }
  )

  context(
    'With an existing export win category, great profile and export potential',
    () => {
      const XHR_ALIAS = 'save-export-edit-2'

      before(() => {
        cy.visit(urls.companies.exports.edit(dnbLimited.id))
      })

      beforeEach(() => {
        cy.intercept('PATCH', '*/v4/company/*').as(XHR_ALIAS)
      })

      it('Should render a list without a selected item', () => {
        cy.get('#field-export_experience_category').then((element) => {
          assertFieldSelect({
            element,
            label: 'Export win category (optional)',
            value: 'Increasing export turnover',
            optionsCount: 7,
          })
        })
      })

      it('Should render the read only items', () => {
        assertReadOnlyItems([
          {
            label: 'great.gov.uk business profile',
            value: '"Find a supplier" profile (opens in a new window or tab)',
          },
          { label: 'Export potential', value: 'Medium' },
        ])

        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'href',
          urls.external.greatProfile(dnbLimited.company_number)
        )
      })

      it('Should render the buttons and clicking Save should save the value', () => {
        assertButtons(dnbLimited.id)

        //selecting the first value should set the category back to null
        selectOption('#field-export_experience_category', 0)

        cy.contains('Save and return').click()

        cy.wait('@' + XHR_ALIAS).then((xhr) => {
          expect(xhr.response.url).to.contain(dnbLimited.id)
          expect(xhr.request.body.export_experience_category).to.equal(null)
        })
      })
    }
  )
})
