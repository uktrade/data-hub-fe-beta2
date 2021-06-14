const { BLACK, GREY_1 } = require('govuk-colours')
const { sortBy } = require('lodash')
const { format, parseISO } = require('date-fns')

const LIKELIHOOD_TO_SUCCEED = require('../../../../../src/client/components/Pipeline/constants')
const inProgress = require('../../../../sandbox/fixtures/v4/pipeline-item/in-progress.json')
const { currencyGBP } = require('../../../../../src/client/utils/number-utils')
const leads = require('../../../../sandbox/fixtures/v4/pipeline-item/leads.json')
const TAG_COLOURS = require('../../../../../src/client/components/Tag/colours')
const win = require('../../../../sandbox/fixtures/v4/pipeline-item/win.json')
const urls = require('../../../../../src/lib/urls')

function assertPipelineItem(
  index,
  { expectedDate, expectedWinDate },
  givenData
) {
  const result = givenData.results[index]
  if (!result) {
    throw Error('Given data is out of range')
  }
  cy.get('[data-auto-id="pipelineSubTabNav"]')
    .get(`ol > li:nth-child(${index + 1})`)
    .within(() => {
      cy.contains('Company')
      cy.contains(result.company.name).should(
        'have.attr',
        'href',
        urls.companies.detail(result.company.id)
      )
      cy.contains('Created')
      cy.contains(expectedDate)
      cy.contains(format(parseISO(result.created_on), 'dd MMM y'))
      if (result.archived) {
        cy.contains(result.name).should('have.colour', GREY_1)
        cy.contains('Delete').should(
          'have.attr',
          'href',
          urls.pipeline.delete(result.id)
        )
        cy.contains('Unarchive').should(
          'have.attr',
          'href',
          urls.pipeline.unarchive(result.id)
        )
        cy.contains('archive this').should('not.exist')
        cy.get('span[aria-label="Likelihood to succeed"]').within(() => {
          cy.contains('Archived')
            .should('have.backgroundColour', TAG_COLOURS.grey.background)
            .should('have.colour', TAG_COLOURS.grey.colour)
        })
        cy.contains(format(parseISO(result.archived_on), 'dd MMM y')).siblings(
          () => {
            cy.contains('Archived')
          }
        )
      } else if (result.likelihood_to_win) {
        cy.get('span[aria-label="Likelihood to succeed"]').within(() => {
          cy.contains('Archived').should('not.exist')
        })
        cy.contains('Edit').should(
          'have.attr',
          'href',
          urls.pipeline.edit(result.id)
        )
        cy.contains('archive this').should(
          'have.attr',
          'href',
          urls.pipeline.archive(result.id)
        )
      } else {
        cy.contains(result.name).should('have.colour', BLACK)
        cy.contains('Edit').should(
          'have.attr',
          'href',
          urls.pipeline.edit(result.id)
        )
        cy.contains('archive this').should(
          'have.attr',
          'href',
          urls.pipeline.archive(result.id)
        )
      }
      if (result.archived_reason) {
        cy.contains('Archive reason')
        cy.contains(result.archived_reason)
      }
      if (result.likelihood_to_win) {
        cy.get('span[aria-label="Likelihood to succeed"]').should('exist')
        cy.contains(LIKELIHOOD_TO_SUCCEED[result.likelihood_to_win].text)
          .should(
            'have.backgroundColour',
            TAG_COLOURS[LIKELIHOOD_TO_SUCCEED[result.likelihood_to_win].colour]
              .background
          )
          .should(
            'have.colour',
            TAG_COLOURS[LIKELIHOOD_TO_SUCCEED[result.likelihood_to_win].colour]
              .colour
          )
      } else {
        const values = Object.values(LIKELIHOOD_TO_SUCCEED).map(
          (item) => item.text
        )
        const regex = new RegExp(`${values.join('|')}`, 'g')
        cy.get('span[aria-label="Likelihood to succeed"]').should('not.exist')
        cy.contains(regex).should('not.exist')
      }

      if (result.expected_win_date) {
        cy.contains('Expected date for win')
        cy.contains(expectedWinDate)
      } else {
        cy.contains('Expected date for win').should('not.exist')
      }

      if (result.potential_value) {
        cy.contains('Potential export value')
        cy.contains(currencyGBP(result.potential_value))
      } else {
        cy.contains('Potential export value').should('not.exist')
      }

      if (result.contacts && result.contacts.length) {
        cy.contains(
          result.contacts.length > 1 ? 'Company contacts' : 'Company contact'
        )
        cy.contains(result.contacts.map(({ name }) => name).join(', '))
      } else if (result.contact) {
        cy.contains('Company contact')
        cy.contains(result.contact.name)
      } else {
        cy.contains('Company contact').should('not.exist')
      }

      if (result.sector) {
        cy.contains('Export sector')
        cy.contains(result.sector.segment)
      } else {
        cy.contains('Export sector').should('not.exist')
      }
    })
}

function assertAcrossTabs(callback) {
  cy.contains('To do').click()
  cy.contains('To do').should('have.attr', 'aria-selected', 'true')
  callback('To do')

  cy.contains('In progress').click()
  cy.contains('In progress').should('have.attr', 'aria-selected', 'true')
  callback('In progress')

  cy.contains('Done').click()
  cy.contains('Done').should('have.attr', 'aria-selected', 'true')
  callback('Done')
}

describe('My pipeline app', () => {
  context('when query string is used by analytic team', () => {
    before(() => {
      cy.visit(
        `${urls.pipeline.index()}?
        some_source=averylongquery&othersource=anotherlongquery`
      )
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('To do').should('have.attr', 'aria-selected', 'true')
        cy.contains('In progress')
        cy.contains('Done')
      })
    })

    it('should render the item counter', () => {
      cy.contains('4 projects')
    })
  })

  context('When viewing the to do status', () => {
    before(() => {
      cy.visit(urls.pipeline.index())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('To do').should('have.attr', 'aria-selected', 'true')
        cy.contains('In progress')
        cy.contains('Done')
      })
    })

    it('should render the item counter', () => {
      cy.contains('4 projects')
    })

    context('should render the pipeline list', () => {
      const expectedOutcomeList = [
        { expectedDate: '15 May 2020' },
        { expectedDate: '14 May 2020' },
        { expectedDate: '13 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '12 May 2020', expectedWinDate: 'May 2021' },
      ]
      expectedOutcomeList.forEach((expectedData, index) => {
        it(`should render the item at index ${index}`, () => {
          assertPipelineItem(index, expectedData, leads)
        })
      })
    })
  })

  context('When viewing the in progress status', () => {
    before(() => {
      cy.visit(urls.pipeline.active())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('To do')
        cy.contains('In progress').should('have.attr', 'aria-selected', 'true')
        cy.contains('Done')
      })
    })

    it('should render the item counter', () => {
      cy.contains('3 projects')
    })

    context('should render the pipeline list', () => {
      it('should render the first item', () => {
        assertPipelineItem(0, { expectedDate: '13 May 2020' }, inProgress)
      })

      it('should render the second item with one contact', () => {
        assertPipelineItem(1, { expectedDate: '12 May 2020' }, inProgress)
      })

      it('should render the third item with two contacts', () => {
        assertPipelineItem(2, { expectedDate: '11 May 2020' }, inProgress)
      })
    })
  })

  context('When viewing the done status', () => {
    before(() => {
      cy.visit(urls.pipeline.won())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('To do')
        cy.contains('In progress')
        cy.contains('Done').should('have.attr', 'aria-selected', 'true')
      })
    })

    it('should render the item counter', () => {
      cy.contains('1 project')
    })

    context('should render the pipeline list', () => {
      it('should render the first item', () => {
        assertPipelineItem(0, { expectedDate: '10 May 2020' }, win)
      })
    })
  })

  context('When filtering pipeline by archived', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/v4/pipeline-item*').as('pipelineGet')
      cy.visit(urls.pipeline.index())
    })

    it('should be un-checked by default', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          assertAcrossTabs(() => cy.wrap(element).should('not.be.checked'))
        })
    })

    it('should keep its checked state across tabs', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).check()
          assertAcrossTabs(() => cy.wrap(element).should('be.checked'))
          cy.wrap(element).uncheck()
          assertAcrossTabs(() => cy.wrap(element).should('not.be.checked'))
        })
    })

    it('should omit ?archive=false from the query string when archive is checked', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.get(element).should('exist')
          cy.wrap(element).check()
          cy.wrap(element).should('be.checked')
          cy.wait('@pipelineGet').then((xhr) => {
            expect(xhr.response.url).to.contain('archived')
          })
          cy.wrap(element).uncheck()
          cy.wrap(element).should('not.be.checked')
          cy.wait('@pipelineGet').then((xhr) => {
            expect(xhr.response.url).to.not.contain('archived')
          })
        })
    })

    it('should add ?archive=false from the query string when archive is unchecked', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).should('not.be.checked')
          cy.wait('@pipelineGet').then((xhr) => {
            expect(xhr.response.url).to.contain('archived')
          })
        })
    })

    it('should render the item counter with only non-archived items', () => {
      cy.contains('4 projects')
    })

    it('should render archived items', () => {
      const expectedOutcomeList = [
        { expectedDate: '15 May 2020' },
        { expectedDate: '14 May 2020' },
        { expectedDate: '13 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '12 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '11 May 2020' },
      ]
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).check()
          cy.wrap(element).should('be.checked')
          return cy.wait('@pipelineGet')
        })
        .then(() => {
          cy.contains('5 projects')
        })
        .then(() => {
          expectedOutcomeList.forEach((expectedData, index) => {
            assertPipelineItem(index, expectedData, leads)
          })
        })
    })
  })

  context('When sorting pipeline', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/v4/pipeline-item*').as('pipelineGet')
      cy.visit(urls.pipeline.index())
      cy.wait('@pipelineGet')
    })

    it('should sort by most recently created by default', () => {
      cy.contains('Sort by')
        .parent()
        .find('select')
        .then((element) => {
          assertAcrossTabs(() => {
            cy.wrap(element).should('have.value', '-created_on')
            cy.wrap(element)
              .find('option:checked')
              .should('have.text', 'Most recently created')
          })
        })
    })

    it('should keep its selected state across tabs', () => {
      cy.contains('Sort by')
        .parent()
        .find('select')
        .then((element) => {
          assertAcrossTabs(() => {
            cy.wrap(element).select('-modified_on')
            cy.wrap(element).should('have.value', '-modified_on')
            cy.wrap(element)
              .find('option:checked')
              .should('have.text', 'Most recently updated')
          })
        })
    })

    context('When sorting when archived is disabled', () => {
      it('should add sortby=name query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Project Name A-Z')
            cy.get(element).should('contain', 'Project Name A-Z')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=name`)
              expect(xhr.response.url).to.contain('archived=false')
            })
          })
      })

      it('should add sortby=-modified_on query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Most recently updated')
            cy.wrap(element).should('contain', 'Most recently updated')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=-modified_on`)
              expect(xhr.response.url).to.contain('archived=false')
            })
          })
      })

      it('should add sortby=-created_on query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Most recently updated')
            cy.wait('@pipelineGet')
            cy.wrap(element).select('Most recently created')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=-created_on`)
              expect(xhr.response.url).to.contain('archived=false')
            })
          })
      })
    })

    context('When sorting when archived is enabled', () => {
      beforeEach(() => {
        cy.contains('Show archived projects')
          .parent()
          .find('input')
          .then((element) => {
            cy.wrap(element).check()
            cy.wrap(element).should('be.checked')
          })
        cy.wait('@pipelineGet')
      })

      it('should add sortby=name query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Project Name A-Z')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=name`)
              expect(xhr.response.url).to.not.contain('archived')
            })
          })
      })

      it('should add sortby=-modified_on query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Most recently updated')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=-modified_on`)
              expect(xhr.response.url).to.not.contain('archived')
            })
          })
      })

      it('should add sortby=-created_on query string', () => {
        cy.contains('Sort by')
          .parent()
          .find('select')
          .then((element) => {
            cy.wrap(element).select('Most recently updated')
            cy.wait('@pipelineGet')
            cy.wrap(element).select('Most recently created')
            cy.wait('@pipelineGet').then((xhr) => {
              expect(xhr.response.url).to.contain(`sortby=-created_on`)
              expect(xhr.response.url).to.not.contain('archived')
            })
          })
      })
    })

    it('should updated the ui with the items sorted', () => {
      const expectedOutcomeList = [
        { expectedDate: '14 May 2020' },
        { expectedDate: '15 May 2020' },
        { expectedDate: '13 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '12 May 2020', expectedWinDate: 'May 2021' },
      ]

      cy.contains('Sort by')
        .parent()
        .find('select')
        .then((element) => {
          cy.wrap(element).should('be.visible')
          cy.wrap(element).select('Most recently updated')
          cy.wait('@pipelineGet').then(() => {
            expectedOutcomeList.forEach((expectedData, index) => {
              assertPipelineItem(index, expectedData, {
                ...leads,
                results: sortBy(
                  leads.results.filter((r) => !r.archived),
                  ['modified_on']
                ).reverse(),
              })
            })
          })
        })
    })
  })
})
