/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/**
 * Tests for: ./src/apps/companies/apps/add-company/client/AddCompanyForm.jsx
 */

const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const gotoOverseasCompanySearchPage = () => {
  cy.visit(urls.companies.create())
  cy.findByRole('radio', { name: /Overseas/i }).check()
  // cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
  cy.findByRole('combobox', { name: /Country/i }).select('Poland')
  // cy.get(selectors.companyAdd.form).find('select').select('Poland')
  cy.findByRole('button', { name: /Continue/i }).click()
  // cy.get(selectors.companyAdd.continueButton).click()
}

const gotoOverseasCompanySearchResultsPage = () => {
  gotoOverseasCompanySearchPage()
  cy.findByRole('searchbox', { name: /Company name/i }).type('a company')
  // cy.get(selectors.companyAdd.entitySearch.companyNameField).type('a company')
  cy.findAllByRole('button', { name: /Find company/i }).click()
  // cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const gotoUKCompanySearchResultsPage = () => {
  cy.visit(urls.companies.create())
  cy.findByRole('radio', { name: /United Kingdom/i }).check()
  // cy.get(selectors.companyAdd.form).find('[type="radio"]').check('GB')
  cy.findByRole('button', { name: /Continue/i }).click()
  // cy.get(selectors.companyAdd.continueButton).click()
  // cy.findByRole('searchbox', { name: /Company name/i }).type('a company')
  cy.findByLabelText('Company name').type('a company')
  // cy.get(selectors.companyAdd.entitySearch.companyNameField).type('a company')
  cy.findByRole('button', { name: /Find company/i }).click()
  // cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const gotoAddUKCompanyPage = (listItem) => {
  gotoUKCompanySearchResultsPage()
  cy.get(listItem).click()
  cy.get(selectors.companyAdd.continueButton).click()
}

const gotoManualAddUKCompanyPage = () => {
  gotoUKCompanySearchResultsPage()
  cy.findByText("I can't find what I'm looking for").click()
  // NOTE: This findByText above is due to the fact that "I can't find what I'm looking for" is a span, not a button.
  // This feels like an accessibility violation.

  // cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
  cy.findByRole('button', {
    name: /I still can't find what I'm looking for/i,
  }).click()
  // cy.get(selectors.companyAdd.entitySearch.cannotFind.stillCannotFind).click()
}

const gotoUKCompanySectorAndRegionPage = () => {
  gotoManualAddUKCompanyPage()
  cy.findByRole('radio', { name: /Limited company/i }).click()
  // cy.get(
  //   selectors.companyAdd.newCompanyRecordForm.organisationType.limitedCompany
  // ).click()
  cy.findByLabelText('Name of company').type('INVESTIGATION LIMITED')
  // cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).type(
  //   'INVESTIGATION LIMITED'
  // )
  cy.findByLabelText("Company's website").type('www.investigationlimited.com')
  // cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
  //   'www.investigationlimited.com'
  // )
  cy.findByLabelText("Company's telephone number").type('0123456789')
  // cy.get(selectors.companyAdd.newCompanyRecordForm.telephone)
  //   .clear()
  //   .type('0123456789')
  cy.findByLabelText('Postcode').type('SW1H 9AJ')
  // cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
  //   'SW1H 9AJ'
  // )
  cy.findByRole('button', { name: /Find UK address/i }).click()
  // cy.get(
  //   selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
  // ).click()
  cy.findByLabelText('Select an address').select('Ministry of Justice')
  // cy.get(selectors.companyAdd.newCompanyRecordForm.address.options).select(
  //   'Ministry of Justice'
  // )
  cy.findByRole('button', { name: /Continue/i }).click()
  // cy.get(selectors.companyAdd.continueButton).click()
}

describe('Add company form', () => {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  context(
    'when viewing a company in the list thats already in Data Hub',
    () => {
      it('should show that the company is already in Data Hub', () => {
        gotoUKCompanySearchResultsPage()
        cy.findByRole('heading', { name: /Some matched company/i })
          .should('exist')
          .next()
          .should(
            'have.text',
            'Trading name(s) Some matched company trading nameLocation at 123 Fake Street, Brighton, BN1 4SE'
          )
          .next()
          .should(
            'have.text',
            'This company is already on Data Hub. You can record activity on the company page.'
          )
        cy.findByRole('link', {
          name: /Go to Some matched company details page to record activity/i,
        })
          .should(
            'have.attr',
            'href',
            urls.companies.detail('0fb3379c-341c-4da4-b825-bf8d47b26baa')
          )
          .should('have.text', 'on the company page.')
        //   cy.get('[data-test="entity-list"] li')
        //     .eq(1)
        //     .find('h3')
        //     .should('have.text', 'Some matched company')
        //     .next()
        //     .should(
        //       'have.text',
        //       'Trading name(s) Some matched company trading nameLocation at 123 Fake Street, Brighton, BN1 4SE'
        //     )
        //     .next()
        //     .should(
        //       'have.text',
        //       'This company is already on Data Hub. You can record activity on the company page.'
        //     )
        //     .find('a')
        //     .should(
        //       'have.attr',
        //       'href',
        //       urls.companies.detail('0fb3379c-341c-4da4-b825-bf8d47b26baa')
        //     )
        //     .should(
        //       'have.attr',
        //       'aria-label',
        //       'Go to Some matched company details page to record activity'
        //     )
      })
    }
  )

  context('when viewing the "Add company form"', () => {
    before(() => {
      cy.visit(urls.companies.create())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Add company': null,
      })
    })

    it('should display "Where is this company located?" heading', () => {
      cy.findByRole('group', {
        name: /Where is this company located?/i,
      }).should('exist')
      // cy.get(selectors.companyAdd.form).contains(
      //   'Where is this company located?'
      // )
    })

    it('should display "Continue" button', () => {
      cy.findByRole('button', { name: /Continue/i }).should('be.visible')
      // cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })

    it('should not display an error message', () => {
      cy.findByText('Specify location of the company').should('not.exist')
      // cy.get(selectors.companyAdd.form)
      //   .contains('Specify location of the company')
      //   .should('not.exist')
    })

    it('should display an error message when no location is selected', () => {
      cy.findByRole('button', { name: /Continue/i }).click()
      cy.findByText('Specify location of the company').should('exist')
      // cy.get(selectors.companyAdd.continueButton).click()
      // cy.get(selectors.companyAdd.form).contains(
      //   'Specify location of the company'
      // )
    })
  })

  context('when "Overseas" is selected for the company location', () => {
    before(() => {
      cy.visit(urls.companies.create())
      cy.findByRole('radio', { name: /Overseas/i }).check()
      // cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should display "Country" selection', () => {
      cy.findByLabelText('Country').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Country')
      cy.findByRole('option', { name: /-- Select country --/i }).should(
        'be.visible'
      )
      // cy.get(selectors.companyAdd.form).find('select').should('be.visible')
    })

    it('should include Hong Kong in the "Country" selection', () => {
      cy.findByLabelText('Country').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Country')
      cy.findByRole('option', { name: /Hong Kong \(SAR\)/i }).should('exist')
      // cy.get(selectors.companyAdd.form)
      //   .find('select option[value="HK"]')
      //   .should('have.length', 1)
      //   .should('have.text', 'Hong Kong (SAR)')
    })

    it('should display an error message when no country is specified', () => {
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
      cy.findByText('Select in which country the company is located').should(
        'exist'
      )
      // cy.get(selectors.companyAdd.form).contains(
      //   'Select in which country the company is located'
      // )
    })
  })

  context('when an overseas country is picked', () => {
    before(() => {
      gotoOverseasCompanySearchPage()
    })

    it('should display the "Find the company" heading', () => {
      cy.findByRole('heading', { name: /Find the company/i }).should('exist')
      // cy.get(selectors.companyAdd.stepHeader).should(
      //   'have.text',
      //   'Find the company'
      // )
    })

    it('should display the selected country', () => {
      cy.findByText('Poland').should('exist')
      cy.findByRole('button', { name: /Change Country/i }).should('exist')
      // cy.get(selectors.companyAdd.form)
      //   .find('fieldset')
      //   .should('have.text', 'CountryPoland Change Country')
    })

    it('should display the "Find company" button', () => {
      cy.findByRole('button', { name: /Find company/i }).should('exist')
      // cy.get(selectors.companyAdd.entitySearch.searchButton).should(
      //   'be.visible'
      // )
    })

    it('should not display the"Back" button', () => {
      cy.findByRole('button', { name: /Back/i }).should('not.exist')
      // cy.get(selectors.companyAdd.backButton).should('not.exist')
    })

    it('should not display the "Continue" button', () => {
      cy.findByRole('button', { name: /Continue/i }).should('not.exist')
      // cy.get(selectors.companyAdd.continueButton).should('not.exist')
    })

    it('should display an error message when the "Company name" field is not filled in', () => {
      cy.findByRole('button', { name: /Find company/i }).click()
      // cy.get(selectors.companyAdd.entitySearch.searchButton).click()
      cy.findByText('Enter company name').should('exist')
      // cy.get(selectors.companyAdd.form).should('contain', 'Enter company name')
      cy.findByText('Enter company name').should('exist')
      // cy.get(selectors.companyAdd.entitySearch.results.someCompanyName).should(
      //   'not.exist'
      // )
      // cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).should(
      //   'not.exist'
      // )
    })

    it('should display an error message when DnB search fails', () => {
      cy.findAllByRole('searchbox', { name: /Company name/i }).type(
        'Simulate 500 Error'
      )
      // cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
      //   'Simulate 500 Error'
      // )
      cy.findByRole('button', { name: /Find company/i }).click()
      cy.get(selectors.companyAdd.entitySearch.searchButton).click()
      cy.findByText('Error occurred while searching for company.').should(
        'exist'
      )
      // cy.get('[data-test="status-message"]')
      //   .should('exist')
      //   .should('contain.text', 'Error occurred while searching for company.')
    })
  })

  context('when an overseas company is searched', () => {
    before(() => {
      gotoOverseasCompanySearchResultsPage()
    })

    it('should display the entity search results', () => {
      cy.findByRole('heading', { name: /Some unmatched company/i }).should(
        'exist'
      )
      cy.findByRole('heading', { name: /Some matched company/i }).should(
        'exist'
      )
      cy.findByRole('heading', {
        name: /Some company \(unknown postcode\)/i,
      }).should('exist')
      // cy.get(selectors.companyAdd.entitySearch.results.someCompanyName).should(
      //   'be.visible'
      // )
      // cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).should(
      //   'be.visible'
      // )
    })
  })

  context('when a company is picked that does not exist on Data Hub', () => {
    before(() => {
      gotoOverseasCompanySearchResultsPage()
      cy.contains('Some unmatched company').click()
    })

    it('should display a confirmation summary', () => {
      cy.findByRole('heading', {
        name: /Confirm you want to add this company to Data Hub/i,
      }).should('exist')
      // cy.get(selectors.companyAdd.stepHeader).should(
      //   'have.text',
      //   'Confirm you want to add this company to Data Hub'
      // )
      cy.findByText('Registered company name').should('exist')
      // cy.get(selectors.companyAdd.summary).should(
      //   'contain',
      //   'Registered company name'
      // )
      cy.findByText('Some unmatched company').should('exist')
      // cy.get(selectors.companyAdd.summary).should(
      //   'contain',
      //   'Some unmatched company'
      // )
      cy.findByText('Companies House number').should('exist')
      // cy.get(selectors.companyAdd.summary).should(
      //   'contain',
      //   'Companies House number'
      // )
      cy.findByText('00016033').should('exist')
      // cy.get(selectors.companyAdd.summary).should('contain', '00016033')
      cy.findByText('Address').should('exist')
      // cy.get(selectors.companyAdd.summary).should('contain', 'Address')
      cy.findByText('123 ABC Road, Brighton, BN2 9QB').should('exist')
      // cy.get(selectors.companyAdd.summary).should(
      //   'contain',
      //   '123 ABC Road, Brighton, BN2 9QB'
      // )
      cy.findByText('Country').should('exist')
      // cy.get(selectors.companyAdd.summary).should('contain', 'Country')
      cy.findByText('Poland').should('exist')
      // cy.get(selectors.companyAdd.summary).should('contain', 'Poland')
    })

    it('should show back and continue buttons', () => {
      cy.findByRole('button', { name: /Back/i }).should('exist')
      // cy.get(selectors.companyAdd.backButton).should('be.visible')
      cy.findByRole('button', { name: /Continue/i }).should('exist')
      // cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })
  })

  context('when adding a company that does not exist on Data Hub', () => {
    beforeEach(() => {
      gotoOverseasCompanySearchResultsPage()
      cy.findByRole('button', { name: /Some unmatched company/i }).click()
      // cy.contains('Some unmatched company').click()
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should render the "Add company" page with a form to add a sector', () => {
      cy.findByRole('heading', { name: /Add company/i }).should('exist')
      // cy.get(selectors.companyAdd.title)
      // cy.should('have.text', 'Add company').and('have.prop', 'tagName', 'H1')
      cy.findByRole('combobox', { name: /DIT Sector/i }).should('exist')
      cy.findByRole('option', { name: /-- Select DIT sector --/i }).should(
        'exist'
      )
      cy.findByRole('button', { name: /Add company/i }).should('exist')
      cy.findByRole('button', { name: /Back/i }).should('exist')
    })

    it('should display an error message when no sector is selected', () => {
      cy.findByRole('button', { name: /Add company/i }).click()
      // cy.get(selectors.companyAdd.submitButton).click()
      cy.findByText('Select DIT sector').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Select DIT sector')
    })

    it('should redirect to the new company activity when a sector is picked', () => {
      cy.findByRole('combobox', { name: /DIT Sector/i }).select('Airports')
      cy.findByRole('button', { name: /Add company/i }).click()
      cy.location('pathname').should(
        'eq',
        urls.companies.activity.index(fixtures.company.someOtherCompany.id)
      )
      cy.findByText('Company added to Data Hub')
      // cy.get(selectors.companyAdd.sectorSelect)
      //   .select('Airports')
      //   .get(selectors.companyAdd.submitButton)
      //   .click()
      //   .location('pathname')
      //   .should(
      //     'eq',
      //     urls.companies.activity.index(fixtures.company.someOtherCompany.id)
      //   )
      // cy.contains('Company added to Data Hub')
    })

    it('should not continue when DnB company creation fails', () => {
      // Choosing the water sector simulates a server error
      cy.findByRole('combobox', { name: /DIT Sector/i }).select('Water')
      // cy.get(selectors.companyAdd.sectorSelect).select('Water')
      cy.findByRole('button', { name: /Add company/i }).click()
      // cy.get(selectors.companyAdd.submitButton).click()
      cy.location('pathname').should('eq', urls.companies.create())
    })
  })

  context('when manually adding a new UK-based company', () => {
    beforeEach(() => {
      gotoManualAddUKCompanyPage()
    })

    it('should display the manual entry form', () => {
      cy.findByRole('radio', { name: /Charity/i }).should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity)
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /Government department or other public body/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .governmentDepartmentOrOtherPublicBody
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /Limited company/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .limitedCompany
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /Limited partnership/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .limitedPartnership
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /^Partnership/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /Sole Trader/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByLabelText('Name of company').should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
      //   'be.visible'
      // )
      cy.findByLabelText("Company's website").should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
      //   'be.visible'
      // )
      cy.findByLabelText("Company's telephone number").should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
      //   'be.visible'
      // )
      cy.findByLabelText('Postcode').should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).should(
      //   'be.visible'
      // )
      cy.findByRole('button', { name: /Find UK address/i }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
      // ).should('be.visible')
      cy.findByText('United Kingdom')
      // cy.get(selectors.companyAdd.form).contains('United Kingdom')
    })

    it('should display errors when the form is incomplete', () => {
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()

      cy.findByText('Select organisation type').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Select organisation type')
      cy.findByText('Enter name').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Enter name')
      cy.findAllByText('Enter a website or phone number').should('exist')
      // cy.get('#field-telephone_number').contains(
      //   'Enter a website or phone number'
      // )
      cy.findByText('Enter address line 1').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Enter address line 1')
      cy.findByText('Enter town or city').should('exist')
      // cy.get(selectors.companyAdd.form).contains('Enter town or city')
    })

    it('should not display "Enter a website or phone number" when the website is present', () => {
      cy.findByLabelText("Company's website").type('www.example.com')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
      //   'www.example.com'
      // )
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
      cy.findByText('Enter a website or phone number').should('not.exist')
      // cy.get(selectors.companyAdd.form).should(
      //   'not.contain',
      //   'Enter a website or phone number'
      // )
    })

    it('should not display "Enter a website or phone number" when the phone number is present', () => {
      cy.findByLabelText("Company's telephone number").type('+01 (23) 456789')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
      //   '+01 (23) 456789'
      // )
      cy.findAllByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
      cy.findByText('Enter a website or phone number').should('not.exist')
      // cy.get(selectors.companyAdd.form).should(
      //   'not.contain',
      //   'Enter a website or phone number'
      // )
    })

    it('should display invalid website URL error when an invalid website URL is entered', () => {
      cy.findByLabelText("Company's website").type('hello')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.website).type('hello')
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()

      cy.findByText('Enter a valid website URL').should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.websiteContainer
      // ).contains('Enter a valid website URL')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.telephoneContainer
      // ).should('not.contain', 'Enter a valid website URL')
    })

    it('should display invalid telephone number error when an invalid telephone number is entered', () => {
      cy.findByLabelText("Company's telephone number").type('©123123123')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
      //   '©123123123'
      // )
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
      cy.findByText('Enter a valid telephone number').should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.telephoneContainer
      // ).contains('Enter a valid telephone number')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.websiteContainer).should(
      //   'not.contain',
      //   'Enter a valid telephone number'
      // )
    })

    it('should display an error when an invalid organisation name is filled', () => {
      cy.findByLabelText('Name of company').type('=INVESTIGATION LIMITED')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).type(
      //   '=INVESTIGATION LIMITED'
      // )
      cy.findByRole('button', { name: /Continue/i }).click()
      // cy.get(selectors.companyAdd.continueButton).click()
      cy.findByText('Enter a valid name').should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.companyNameContainer
      // ).contains('Enter a valid name')
    })
  })

  context('when valid details are submitted for a new UK company', () => {
    beforeEach(() => {
      gotoUKCompanySectorAndRegionPage()
    })

    it('should render the region and sector fields', () => {
      cy.findByLabelText('DIT region').should('contain.text', 'London')
      // cy.get(selectors.companyAdd.form).contains('London')
      cy.findByLabelText('DIT sector').should(
        'contain.text',
        '-- Select DIT sector --'
      )
      // cy.get(selectors.companyAdd.form).contains('Select DIT sector')
    })

    it('should show errors when continuing without a region or sector', () => {
      cy.findByLabelText('DIT region').select('-- Select DIT region --')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.region).select(
      //   '-- Select DIT region --'
      // )
      cy.findAllByRole('button', { name: /Add company/i }).click()
      cy.findByText('Select DIT region').should('be.visible')
      cy.findByText('Select DIT sector').should('be.visible')
      // cy.get(selectors.companyAdd.submitButton)
      //   .click()
      //   .get(selectors.companyAdd.form)
      //   .contains('Select DIT region')
      //   .get(selectors.companyAdd.form)
      //   .contains('Select DIT sector')
    })

    it('should not continue when the DnB investigation api call fails', () => {
      cy.findByLabelText('DIT region').select('London')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.region).select('London')
      // Water sector simulates a server error from dnb investigation post
      cy.findByLabelText('DIT sector').select('Water')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select('Water')
      cy.findByRole('button', { name: /Add company/i }).click()
      // cy.get(selectors.companyAdd.submitButton).click()

      cy.location('pathname').should('eq', urls.companies.create())
    })
  })

  context('when a valid sector and region are submitted', () => {
    before(() => {
      gotoUKCompanySectorAndRegionPage()
      cy.findByLabelText('DIT region').select('London')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.region).select('London')
      cy.findByLabelText('DIT sector').select('Advanced Engineering')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select(
      //   'Advanced Engineering'
      // )
      cy.findByRole('button', { name: /Add Company/i }).click()
      // cy.get(selectors.companyAdd.submitButton).click()
    })
    it('should redirect to the new company activity', () => {
      cy.location('pathname').should(
        'eq',
        `/companies/${fixtures.company.investigationLimited.id}/activity`
      )
    })
    it('should display the flash message', () => {
      cy.findByText('Company added to Data Hub').should('be.visible')
      // cy.contains('Company added to Data Hub')
    })
    it('should display the pending D&B investigation message', () => {
      cy.findByText(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      ).should('be.visible')
      // cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should(
      //   'be.visible'
      // )
    })
  })

  context('when manually adding a new overseas company', () => {
    before(() => {
      gotoOverseasCompanySearchResultsPage()

      cy.findByText("I can't find what I'm looking for").click()
      // cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
      cy.findByRole('button', {
        name: /I still can't find what I'm looking for/i,
      }).click()
      // cy.get(
      //   selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
      // ).click()
    })

    it('should display the manual entry form', () => {
      cy.findByRole('radio', { name: /Charity/i }).should('exist')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity)
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', {
        name: /Government department or other public body/i,
      }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .governmentDepartmentOrOtherPublicBody
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', { name: /Limited company/i }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .limitedCompany
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', { name: /Limited partnership/i }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType
      //     .limitedPartnership
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', { name: /^Partnership/i }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByRole('radio', { name: /Sole Trader/i }).should('exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
      // )
      //   .parent()
      //   .should('be.visible')
      cy.findByLabelText('Name of company').should('be.visible')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
      //   'be.visible'
      // )
      cy.findByLabelText("Company's website").should('be.visible')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
      //   'be.visible'
      // )
      cy.findByLabelText("Company's telephone number").should('be.visible')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
      //   'be.visible'
      // )
      cy.findByLabelText('Postcode (optional)').should('be.visible')
      // cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).should(
      //   'be.visible'
      // )
      cy.findByText('Poland').should('be.visible')
      // cy.get(selectors.companyAdd.form).contains('Poland')
    })

    it('should hide the UK-related fields', () => {
      cy.findByRole('button', { name: /Find UK address/i }).should('not.exist')
      // cy.get(
      //   selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
      // ).should('not.exist')
    })
  })

  context('when "UK" is selected for the company location', () => {
    beforeEach(() => {
      const { results } = selectors.companyAdd.entitySearch
      gotoAddUKCompanyPage(results.someCompanyName)
    })

    it('should render an "Add a company" H1 element', () => {
      cy.get(selectors.companyAdd.title).should('have.text', 'Add company')
    })

    it('should render a form with both "Region" and "Sector" selects', () => {
      cy.contains('DIT region')
        .next()
        .find('select option:selected')
        .should('have.text', 'London')
        .parent()
        .parent()
        .parent()
        .next()
        .contains('DIT sector')
        .next()
        .find('select option:selected')
        .should('have.text', '-- Select DIT sector --')
        .parent()
        .parent()
        .parent()
        .next()
        .contains('Add company')
        .and('match', 'button')
        .next()
        .contains('Back')
        .and('match', 'button')
    })

    it('should error when attempting to add a company without region or sector', () => {
      cy.get(selectors.companyAdd.submitButton)
        .click()
        .get(selectors.companyAdd.form)
        .contains('Select DIT region')
        .get(selectors.companyAdd.form)
        .contains('Select DIT sector')
    })

    it('should add a company after defining both region and sector', () => {
      cy.get(selectors.companyAdd.regionSelect)
        .select('South East')
        .get(selectors.companyAdd.sectorSelect)
        .select('Airports')
        .get(selectors.companyAdd.submitButton)
        .click()
        .location('pathname')
        .should(
          'eq',
          `/companies/${fixtures.company.someOtherCompany.id}/activity`
        )
      cy.contains('Company added to Data Hub')
    })
  })

  context('when a UK company postcode is unknown', () => {
    before(() => {
      const { results } = selectors.companyAdd.entitySearch
      gotoAddUKCompanyPage(results.companyUnknownPostcode)
    })

    it('should prompt the user to select a "Region"', () => {
      cy.contains('DIT region')
        .next()
        .find('select option:selected')
        .should('have.text', '-- Select DIT region --')
    })
  })
})
