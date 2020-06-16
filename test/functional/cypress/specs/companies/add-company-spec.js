/**
 * Tests for: ./src/apps/companies/apps/add-company/client/AddCompanyForm.jsx
 */

const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const selectUKCompanyAndSelectListItem = (listItem) => {
  cy.visit(urls.companies.create())
    .get(selectors.companyAdd.form)
    .find('[type="radio"]')
    .check('GB')
    .get(selectors.companyAdd.continueButton)
    .click()
    .get(selectors.companyAdd.entitySearch.companyNameField)
    .type('some company')
    .get(selectors.companyAdd.entitySearch.searchButton)
    .click()
    .get(listItem)
    .click()
    .get(selectors.companyAdd.continueButton)
    .click()
}

describe('Add company form', () => {
  beforeEach(function() {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

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
      cy.get(selectors.companyAdd.stepHeader).should(
        'have.text',
        'Where is this company located?'
      )
    })

    it('should display "Continue" button', () => {
      cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })

    context(
      'when "Continue" button is pressed without specifying the company location',
      () => {
        before(() => {
          cy.get(selectors.companyAdd.continueButton).click()
        })

        it('should display error message', () => {
          cy.get(selectors.companyAdd.form).contains(
            'Specify location of the company'
          )
        })
      }
    )

    context('when "Overseas" is selected for the company location', () => {
      before(() => {
        cy.get(selectors.companyAdd.form)
          .find('[type="radio"]')
          .check('overseas')
      })

      it('should display "Country" selection', () => {
        cy.get(selectors.companyAdd.form).contains('Country')
        cy.get(selectors.companyAdd.form)
          .find('select')
          .should('be.visible')
      })
    })

    context(
      'when I click the "Continue" button without specifying company country',
      () => {
        before(() => {
          cy.get(selectors.companyAdd.continueButton).click()
        })

        it('should display error message', () => {
          cy.get(selectors.companyAdd.form).contains(
            'Select in which country the company is located'
          )
        })
      }
    )

    context(
      'when I click the "Continue" button after filling the required fields',
      () => {
        before(() => {
          cy.get(selectors.companyAdd.form)
            .find('select')
            .select('Poland')
          cy.get(selectors.companyAdd.continueButton).click()
        })

        it('should display the "Find the company" heading', () => {
          cy.get(selectors.companyAdd.stepHeader).should(
            'have.text',
            'Find the company'
          )
        })

        it('should display the selected country', () => {
          cy.get(selectors.companyAdd.form)
            .find('fieldset')
            .should('have.text', 'CountryPoland Change Country')
        })

        it('should display the "Find company" button', () => {
          cy.get(selectors.companyAdd.entitySearch.searchButton).should(
            'be.visible'
          )
        })

        it('should not display the"Back" button', () => {
          cy.get(selectors.companyAdd.backButton).should('not.be.visible')
        })

        it('should not display the "Continue" button', () => {
          cy.get(selectors.companyAdd.continueButton).should('not.be.visible')
        })

        context(
          'when the "Find company" button is clicked without filling the required "Company name" field',
          () => {
            before(() => {
              cy.get(selectors.companyAdd.entitySearch.searchButton).click()
            })

            it('should display an error message for the "Company name" field', () => {
              cy.get(selectors.companyAdd.form).should(
                'contain',
                'Enter company name'
              )
            })

            it('should not display the entity search results', () => {
              cy.get(
                selectors.companyAdd.entitySearch.results.someCompanyName
              ).should('not.be.visible')
              cy.get(
                selectors.companyAdd.entitySearch.results.someOtherCompany
              ).should('not.be.visible')
            })
          }
        )

        context(
          'when the "Find company" button  is clicked after filling the required "Company name" field',
          () => {
            before(() => {
              cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
                'some company'
              )
              cy.get(selectors.companyAdd.entitySearch.searchButton).click()
            })

            it('should display the entity search results', () => {
              cy.get(
                selectors.companyAdd.entitySearch.results.someCompanyName
              ).should('be.visible')
              cy.get(
                selectors.companyAdd.entitySearch.results.someOtherCompany
              ).should('be.visible')
            })

            context(
              'when a company is clicked that does not exist on Data Hub',
              () => {
                before(() => {
                  cy.contains('Some unmatched company').click()
                })

                it('should display "Confirm you want to add this company to Data Hub" subheader', () => {
                  cy.get(selectors.companyAdd.stepHeader).should(
                    'have.text',
                    'Confirm you want to add this company to Data Hub'
                  )
                })

                it('should display company name', () => {
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Registered company name'
                  )
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Some unmatched company'
                  )
                })

                it('should display Companies House number', () => {
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Companies House number'
                  )
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    '00016033'
                  )
                })

                it('should display address', () => {
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Address'
                  )
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    '123 ABC Road, Brighton, BN2 9QB'
                  )
                })

                it('should display country', () => {
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Country'
                  )
                  cy.get(selectors.companyAdd.summary).should(
                    'contain',
                    'Poland'
                  )
                })

                it('should display "Back" button', () => {
                  cy.get(selectors.companyAdd.backButton).should('be.visible')
                })

                it('should display "Continue" button', () => {
                  cy.get(selectors.companyAdd.continueButton).should(
                    'be.visible'
                  )
                })

                context('when the "Continue" button is clicked', () => {
                  before(() => {
                    cy.get(selectors.companyAdd.continueButton).click()
                  })

                  it('should render the "Add company" page', () => {
                    cy.get(selectors.companyAdd.title)
                    cy.should('have.text', 'Add company').and(
                      'have.prop',
                      'tagName',
                      'H1'
                    )
                  })

                  it('should contain a form to add a sector', () => {
                    cy.contains('DIT sector')
                      .next()
                      .get('select option:selected')
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

                  it('should display an error message', () => {
                    cy.get(selectors.companyAdd.submitButton).click()
                    cy.get(selectors.companyAdd.form).contains(
                      'Select DIT sector'
                    )
                  })

                  it('should redirect to the new company activity', () => {
                    cy.get(selectors.companyAdd.sectorSelect)
                      .select('Airports')
                      .get(selectors.companyAdd.submitButton)
                      .click()
                      .location('pathname')
                      .should(
                        'eq',
                        urls.companies.activity.index(
                          fixtures.company.someOtherCompany.id
                        )
                      )
                  })

                  it('should display the flash message', () => {
                    cy.contains('Company added to Data Hub')
                  })
                })
              }
            )
          }
        )
      }
    )
  })

  context(
    `when "I still can't find what I'm looking for" is clicked for a UK-based company`,
    () => {
      before(() => {
        cy.visit(urls.companies.create())
        cy.get(selectors.companyAdd.form)
          .find('[type="radio"]')
          .check('GB')
        cy.get(selectors.companyAdd.continueButton).click()
        cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
          'some company'
        )
        cy.get(selectors.companyAdd.entitySearch.searchButton).click()
        cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
        cy.get(
          selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
        ).click()
      })
      it('should display the form', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.charity
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .governmentDepartmentOrOtherPublicBody
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .limitedCompany
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .limitedPartnership
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
        ).should('be.visible')
        cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
          'be.visible'
        )
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.address.postcode
        ).should('be.visible')
        cy.get(selectors.companyAdd.form).contains('United Kingdom')
        cy.get(selectors.companyAdd.newCompanyRecordForm.sector).should(
          'be.visible'
        )
      })
      it('should display the UK-related fields', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
        ).should('be.visible')
        cy.get(selectors.companyAdd.newCompanyRecordForm.region).should(
          'be.visible'
        )
      })
      context(
        'when the form is submitted without filling the required fields',
        () => {
          before(() => {
            cy.get(selectors.companyAdd.submitButton).click()
          })
          it('should display errors', () => {
            cy.get(selectors.companyAdd.form).contains(
              'Select organisation type'
            )
            cy.get(selectors.companyAdd.form).contains('Enter name')
            cy.get('#field-website').contains('Enter a website or phone number')
            cy.get('#field-telephone_number').contains(
              'Enter a website or phone number'
            )
            cy.get(selectors.companyAdd.form).contains('Enter address line 1')
            cy.get(selectors.companyAdd.form).contains('Enter town or city')
            cy.get(selectors.companyAdd.form).contains('Select DIT region')
            cy.get(selectors.companyAdd.form).contains('Select DIT sector')
          })
        }
      )
      context('when only the website is submitted', () => {
        before(() => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
            'www.example.com'
          )
          cy.get(selectors.companyAdd.submitButton).click()
        })
        it('should not display "Enter a website or phone number"', () => {
          cy.get(selectors.companyAdd.form).should(
            'not.contain',
            'Enter a website or phone number'
          )
        })
        after(() => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.website).clear()
        })
      })
      context('when only the phone number is submitted', () => {
        before(() => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
            '0123456789'
          )
          cy.get(selectors.companyAdd.submitButton).click()
        })
        it('should not display "Enter a website or phone number"', () => {
          cy.get(selectors.companyAdd.form).should(
            'not.contain',
            'Enter a website or phone number'
          )
        })
        after(() => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).clear()
        })
      })
      context('when an invalid website URL is filled', () => {
        before(() => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
            'hello'
          )
          cy.get(selectors.companyAdd.submitButton).click()
        })
        it('should display invalid website URL error', () => {
          cy.get(selectors.companyAdd.form).contains(
            'Enter a valid website URL'
          )
        })
      })
      context(
        'when the form is submitted after filling the required fields',
        () => {
          before(() => {
            cy.server()
              .route('GET', '/api/postcode-to-region-lookup/SW1H 9AJ')
              .as('postcodeToRegion')

            cy.get(
              selectors.companyAdd.newCompanyRecordForm.organisationType
                .limitedCompany
            ).click()
            cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).type(
              'INVESTIGATION LIMITED'
            )
            cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
              'www.investigationlimited.com'
            )
            cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
              '0123456789'
            )
            cy.get(
              selectors.companyAdd.newCompanyRecordForm.address.postcode
            ).type('SW1H 9AJ')
            cy.get(
              selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
            ).click()
            cy.get(
              selectors.companyAdd.newCompanyRecordForm.address.options
            ).select('Ministry of Justice')

            cy.wait('@postcodeToRegion').should((xhr) => {
              expect(xhr.status, 'successful GET').to.equal(200)
              expect(xhr.url).to.contain(
                '/api/postcode-to-region-lookup/SW1H 9AJ'
              )
              expect(xhr.response.body.label).to.contain('London')
            })

            cy.get(selectors.companyAdd.newCompanyRecordForm.region).select(
              'London'
            )

            cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select(
              'Advanced Engineering'
            )
            cy.get(selectors.companyAdd.submitButton).click()
          })
          it('should redirect to the new company activity', () => {
            cy.location('pathname').should(
              'eq',
              `/companies/${fixtures.company.investigationLimited.id}/activity`
            )
          })
          it('should display the flash message', () => {
            cy.contains('Company added to Data Hub')
          })
          it('should display the pending D&B investigation message', () => {
            cy.get(
              selectors.companyActivity.pendingDnbInvestigationMessage
            ).should('be.visible')
          })
        }
      )
    }
  )

  context(
    `when "I still can't find what I'm looking for" is clicked for an overseas country`,
    () => {
      before(() => {
        cy.visit(urls.companies.create())

        cy.get(selectors.companyAdd.form)
          .find('[type="radio"]')
          .check('overseas')
        cy.get(selectors.companyAdd.form)
          .find('select')
          .select('India')
        cy.get(selectors.companyAdd.continueButton).click()

        cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
          'some company'
        )
        cy.get(selectors.companyAdd.entitySearch.searchButton).click()

        cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
        cy.get(
          selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
        ).click()
      })

      it('should display the form', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.charity
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .governmentDepartmentOrOtherPublicBody
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .limitedCompany
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType
            .limitedPartnership
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
        ).should('be.visible')
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
        ).should('be.visible')
        cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
          'be.visible'
        )
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.address.postcode
        ).should('be.visible')
        cy.get(selectors.companyAdd.newCompanyRecordForm.sector).should(
          'be.visible'
        )
        cy.get(selectors.companyAdd.form).contains('India')
      })

      it('should hide the UK-related fields', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
        ).should('not.be.visible')
        cy.get(selectors.companyAdd.newCompanyRecordForm.region).should(
          'not.be.visible'
        )
      })
    }
  )

  context('when "UK" is selected for the company location', () => {
    before(() => {
      const { results } = selectors.companyAdd.entitySearch
      selectUKCompanyAndSelectListItem(results.someCompanyName)
    })

    it('should render an "Add a company" H1 element', () => {
      cy.get(selectors.companyAdd.title).should('have.prop', 'tagName', 'H1')
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

  context(
    'when "UK" is selected and the company postcode is unknown to the Data Store Service',
    () => {
      before(() => {
        const { results } = selectors.companyAdd.entitySearch
        selectUKCompanyAndSelectListItem(results.companyUnknownPostcode)
      })

      it('should prompt the user to select a "Region"', () => {
        cy.contains('DIT region')
          .next()
          .find('select option:selected')
          .should('have.text', '-- Select DIT region --')
      })
    }
  )
})
