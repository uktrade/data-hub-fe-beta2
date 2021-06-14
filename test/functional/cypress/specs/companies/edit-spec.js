const { convertUsdToGbp } = require('../../../../../src/common/currency')
const { roundToSignificantDigits } = require('../../../../../src/common/number')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

import {
  testBreadcrumbs,
  assertFieldUneditable,
  assertFieldInput,
  assertFieldAddress,
  assertFieldSelect,
  assertFieldRadios,
  assertDetails,
} from '../../support/assertions'

const assertRegisteredAddress = ({ element, ukBased }) =>
  cy
    .wrap(element)
    .find('legend')
    .should('have.text', 'Registered address')
    .next()
    .should(
      'have.text',
      ukBased
        ? 'A registered office address is a legal requirement of all limited' +
            ' companies and Limited Liability Partnerships (LLPs) incorporated' +
            ' in the UK. Its purpose is to provide Companies House, HMRC and' +
            ' other relevant government bodies with an official address for' +
            ' delivering statutory mail and legal notices.'
        : 'A registered office address is the official address of an' +
            ' incorporated company or any other legal entity. Its purpose is to' +
            ' provide an official address for delivering statutory mail and legal notices.'
    )

const describeCompanyEditForm = ({ company, elements }) => {
  testBreadcrumbs({
    Home: urls.dashboard(),
    Companies: urls.companies.index(),
    [company.name]: urls.companies.detail(company.id),
    'Business details': urls.companies.businessDetails(company.id),
    'Edit business details': null,
  })

  it('should render page contents', () => {
    const spec = [
      ...elements,
      {
        assert: ({ element }) =>
          cy
            .wrap(element)
            .find('button')
            .should('have.text', 'Submit')
            .next()
            .should('have.text', 'Return without saving')
            .and(
              'have.attr',
              'href',
              urls.companies.businessDetails(company.id)
            ),
      },
    ]

    cy.get('#edit-company-form form div')
      .as('formRoot')
      .children()
      .each((element, i) => {
        if (spec[i]) {
          const { assert, ...params } = spec[i]
          assert({ element, ...params })
        }
      })
  })
}

describe('Company edit', () => {
  context('when editing unmatched UK company on the One List', () => {
    const company = fixtures.company.venusLtd

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'VAT number (optional)',
          value: company.vat_number,
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'DIT region',
          value: company.uk_region.name,
          optionsCount: 16,
          assert: assertFieldSelect,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
          assert: assertFieldRadios,
          optionsCount: 4,
        },
        {
          label: 'Number of employees (optional)',
          assert: assertFieldRadios,
          optionsCount: 5,
        },
        {
          label: 'Sector',
          value: company.sector.name,
          assert: assertFieldUneditable,
        },
        {
          summary: 'Need to edit the sector?',
          content:
            'If you need to change the sector for a company on the' +
            ' One List, please email onelist@example.com',
          assert: assertDetails,
        },
        {
          label: 'Business hierarchy',
          value: 'Not a headquarters',
          assert: assertFieldUneditable,
        },
        {
          summary: 'Need to edit the headquarter type?',
          content:
            'If you need to change the headquarter type for a company' +
            ' on the One List, please email onelist@example.com',
          assert: assertDetails,
        },
      ],
    })
  })

  context('when editing unmatched foreign company NOT on the One List', () => {
    const company = fixtures.company.marsExportsLtd

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
          value: company.turnover_range.name,
          assert: assertFieldRadios,
          optionsCount: 4,
        },
        {
          label: 'Number of employees (optional)',
          value: company.employee_range.name,
          assert: assertFieldRadios,
          optionsCount: 5,
        },
        {
          label: 'DIT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          label: 'Business hierarchy',
          optionsCount: 4,
          assert: assertFieldRadios,
        },
      ],
    })
  })

  context('when editing matched UK company NOT on the One List', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Company name',
          value: company.name,
          assert: assertFieldInput,
        },
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
          value: roundToSignificantDigits(convertUsdToGbp(company.turnover), 2),
          assert: assertFieldInput,
        },
        {
          label: 'Number of employees (optional)',
          value: company.number_of_employees,
          assert: assertFieldInput,
        },
        {
          label: 'DIT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          assert: ({ element }) =>
            cy
              .wrap(element)
              .should('have.text', 'After you click submit')
              .and('match', 'h2'),
        },
        {
          assert: ({ element }) =>
            cy
              .wrap(element)
              .should(
                'have.text',
                'Changes will be reviewed by our third-party data' +
                  ' supplier and updated. Business description, website, region and' +
                  ' sector are not updated by third parties.'
              ),
        },
      ],
    })
  })

  context('when form is submitted for a matched company', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.intercept('POST', urls.companies.edit(company.id) + '*').as(
        'editCompanyResponse'
      )
      cy.visit(urls.companies.edit(company.id))
    })

    it('should redirect to the business details page', () => {
      cy.contains('Company name')
        .next()
        .find('input')
        .clear()
        .type('Test company name')

      cy.contains('Trading name')
        .next()
        .find('input')
        .clear()
        .type('Test company trading name')

      cy.contains('Website (optional)')
        .next()
        .find('input')
        .clear()
        .type('example.com')

      cy.contains('Submit').click()

      cy.wait('@editCompanyResponse').then((xhr) => {
        expect(xhr.request.body.name).to.equal('Test company name')
        expect(xhr.request.body.trading_names).to.equal(
          'Test company trading name'
        )
        expect(xhr.request.body.website).to.equal('example.com')
      })

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
    })

    it('displays the "Change requested. Thanks for keeping Data Hub running smoothly" flash message and the ID used in GA', () => {
      cy.contains(
        'Change requested.Thanks for keeping Data Hub running smoothly.'
      ).should('have.attr', 'id', 'message-company-change-request')
    })
  })

  context('when form is submitted for unmatched company', () => {
    const company = fixtures.company.marsExportsLtd

    before(() => {
      cy.intercept('POST', urls.companies.edit(company.id) + '*').as(
        'editCompanyResponse'
      )
      cy.visit(urls.companies.edit(company.id))
    })

    it('should update the company record and redirect to the business details', () => {
      cy.contains('Trading name')
        .next()
        .find('input')
        .clear()
        .type('Test company trading name')
      cy.contains('Submit').click()

      cy.wait('@editCompanyResponse').then((xhr) => {
        expect(xhr.request.body.trading_names).to.equal(
          'Test company trading name'
        )
      })

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
      cy.contains('Company record updated')
    })
  })

  context('when the form is submitted and there are no changes', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.server()
      cy.visit(urls.companies.edit(company.id))
    })

    it('should redirect back to the Business Details page', () => {
      cy.contains('Submit').click()
      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
    })
  })
})
