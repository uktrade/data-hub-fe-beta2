const urls = require('../../../../../../src/lib/urls')

const lambdaPlc = require('../../../../../sandbox/fixtures/v4/company/company-lambda-plc.json')
const dnbCorp = require('../../../../../sandbox/fixtures/v4/company/company-dnb-corp.json')
const oneListCorp = require('../../../../../end-to-end/cypress/fixtures/company/one-list-corp.json')
const metadataCountries = require('../../../../../sandbox/fixtures/v4/metadata/country.json')

const selectors = {
  currentlyExporting: '#field-currently_exporting',
  futureInterest: '#field-future_interest',
  notInterested: '#field-not_interested',
}

function assertTypeaheadValues(selector, ...values) {
  const VALUES_ALIAS = 'typeahead-values'
  cy.get(selector).find('[class*=multiValue]').as(VALUES_ALIAS)

  values.forEach((value) => {
    cy.get('@' + VALUES_ALIAS).contains(value)
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

function getExportCountry({ name, status }) {
  const country = metadataCountries.find((country) => country.name === name)

  if (country) {
    return {
      country: { id: country.id },
      status,
    }
  }
}

function getExportCountries(countries) {
  return countries.map(getExportCountry)
}

describe('Company Export tab - Edit export countries', () => {
  context('Adding countries to each field with a 500 response', () => {
    const XHR_ALIAS = 'save-export-edit-countries-1'

    before(() => {
      cy.visit(urls.companies.exports.editCountries(lambdaPlc.id))
    })

    beforeEach(() => {
      cy.intercept('PATCH', '*/v4/company/*/export-detail').as(XHR_ALIAS)
    })

    it('Should enter values for currently exporting', () => {
      cy.get(selectors.currentlyExporting)
        .should('have.prop', 'tagName', 'DIV')
        .selectTypeaheadOption('Spai')
        .selectTypeaheadOption('Fran')

      assertTypeaheadValues(selectors.currentlyExporting, 'Spain', 'France')
    })

    it('Should enter values for future countries of interest', () => {
      cy.get(selectors.futureInterest)
        .should('have.prop', 'tagName', 'DIV')
        .selectTypeaheadOption('Braz')
        .selectTypeaheadOption('Chin')

      assertTypeaheadValues(selectors.futureInterest, 'Brazil', 'China')
    })

    it('Should enter values for countries of no interest', () => {
      cy.get(selectors.notInterested)
        .should('have.prop', 'tagName', 'DIV')
        .selectTypeaheadOption('Hon')

      assertTypeaheadValues(selectors.notInterested, 'Honduras')
    })

    it('Should render the buttons', () => {
      assertButtons(lambdaPlc.id)
    })

    it('Should try an save the values then show an alert', () => {
      cy.contains('Save and return').click()

      cy.wait('@' + XHR_ALIAS).then((xhr) => {
        expect(xhr.response.url).to.contain(lambdaPlc.id)
        expect(xhr.request.body.export_countries).to.deep.equal(
          getExportCountries([
            { name: 'Spain', status: 'currently_exporting' },
            { name: 'France', status: 'currently_exporting' },
            { name: 'Brazil', status: 'future_interest' },
            { name: 'China', status: 'future_interest' },
            { name: 'Honduras', status: 'not_interested' },
          ])
        )

        cy.get('[role="alert"]').contains(
          'Export countries could not be saved, try again later'
        )
      })
    })
  })

  context('Adding the same country to two fields with a 400 response', () => {
    const XHR_ALIAS = 'save-export-edit-countries-2'

    before(() => {
      cy.visit(urls.companies.exports.editCountries(dnbCorp.id))
    })

    beforeEach(() => {
      cy.intercept('PATCH', '*/v4/company/*/export-detail').as(XHR_ALIAS)
    })

    it('Should enter values for currently exporting', () => {
      cy.get(selectors.currentlyExporting)
        .should('have.prop', 'tagName', 'DIV')
        .selectTypeaheadOption('Spai')

      assertTypeaheadValues(selectors.currentlyExporting, 'Spain')
    })

    it('Should enter values for future countries of interest', () => {
      cy.get(selectors.futureInterest)
        .should('have.prop', 'tagName', 'DIV')
        .selectTypeaheadOption('Spai')

      assertTypeaheadValues(selectors.futureInterest, 'Spain')
    })

    it('Should render the buttons', () => {
      assertButtons(dnbCorp.id)
    })

    it('Should try an save the values then show an alert', () => {
      cy.contains('Save and return').click()

      cy.wait('@' + XHR_ALIAS).then((xhr) => {
        expect(xhr.response.url).to.contain(dnbCorp.id)
        expect(xhr.request.body.export_countries).to.deep.equal(
          getExportCountries([
            { name: 'Spain', status: 'currently_exporting' },
            { name: 'Spain', status: 'future_interest' },
          ])
        )
        cy.get('[role="alert"]').contains(xhr.response.body.non_field_errors[0])
      })
    })
  })

  context('Adding no countries with a 200 response', () => {
    const XHR_ALIAS = 'save-export-edit-countries-3'

    before(() => {
      cy.visit(urls.companies.exports.editCountries(oneListCorp.id))
    })

    beforeEach(() => {
      cy.intercept('PATCH', '*/v4/company/*/export-detail').as(XHR_ALIAS)
    })

    it('Should save and return back to the exports index', () => {
      cy.contains('Save and return').click()

      cy.wait('@' + XHR_ALIAS).then((xhr) => {
        expect(xhr.response.url).to.contain(oneListCorp.id)
        expect(xhr.request.body.export_countries).to.deep.equal([])
        cy.url().should('contain', urls.companies.exports.index(oneListCorp.id))
      })
    })
  })
})
