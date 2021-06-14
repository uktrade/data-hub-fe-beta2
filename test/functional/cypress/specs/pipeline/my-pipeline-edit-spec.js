const pipelineItemLambdaPlc = require('../../../../sandbox/fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldRadiosWithLegend,
  assertBreadcrumbs,
  assertFieldInput,
  assertFieldTypeahead,
  assertFieldDateShort,
} = require('../../support/assertions')

const selectors = require('../../../../selectors')

const formSelectors = selectors.pipelineForm
const [firstItem, secondItem] = pipelineItemLambdaPlc.results

describe('Pipeline edit form', () => {
  context('When pipeline id is incorrect', () => {
    before(() => {
      cy.visit(urls.pipeline.edit('INCORRECT_PIPELINE'))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        'My Pipeline': urls.pipeline.index(),
        'Edit project': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-auto-id="localHeader"] h1').should(
        'have.text',
        'Edit project'
      )
    })

    it('should render 404 error message', () => {
      cy.contains('There is a problem')
      cy.contains('Not Found')
    })
  })

  context('When editing a pipeline item', () => {
    context('With values for only the mandatory fields', () => {
      before(() => {
        cy.visit(urls.pipeline.edit(firstItem.id))
      })

      it('should render the breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          'My Pipeline': urls.pipeline.index(),
          'Edit project': null,
        })
      })

      it('should render the heading', () => {
        cy.get('[data-auto-id="localHeader"] h1').should(
          'have.text',
          `Edit project`
        )
      })

      it('should render the project name text input', () => {
        cy.get(formSelectors.fields.name).then((element) => {
          assertFieldInput({
            element,
            label: 'Project name',
            value: firstItem.name,
          })
        })
      })

      it('should render the status radio buttons', () => {
        cy.get(formSelectors.fields.status).then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Choose a status',
            optionsCount: 3,
            value: 'In progress',
          })
        })
      })

      it('Should render the likelihood to export radio buttons', () => {
        cy.get(formSelectors.fields.likelihood).then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Likelihood to export (optional)',
            optionsCount: 3,
          })
        })
      })

      it('Should render the export sector typeahead', () => {
        cy.get(formSelectors.fields.sector).then((element) => {
          assertFieldTypeahead({ element, label: 'Export sector (optional)' })
        })
      })

      it('Should render the company contacts typeahead', () => {
        cy.get(formSelectors.fields.contacts).then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Company contacts (optional)',
          })
        })
      })

      it('Should render the potential export value input', () => {
        cy.get(formSelectors.fields.value).then((element) => {
          assertFieldInput({
            element,
            label: 'Potential export value (optional)',
            hint: 'Amount in GBP',
          })
        })
      })

      it('Should render the expected date for win input', () => {
        cy.get(formSelectors.fields.expectedWinDate).then((element) => {
          assertFieldDateShort({
            element,
            label: 'Expected date for win (optional)',
            hint: 'For example 11 2020',
          })
        })
      })
    })

    context('With values for all fields', () => {
      before(() => {
        cy.visit(urls.pipeline.edit(secondItem.id))
      })

      it('should render the breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          'My Pipeline': urls.pipeline.index(),
          'Edit project': null,
        })
      })

      it('should render the heading', () => {
        cy.get('[data-auto-id="localHeader"] h1').should(
          'have.text',
          'Edit project'
        )
      })

      it('should render the project name text input', () => {
        cy.get(formSelectors.fields.name).then((element) => {
          assertFieldInput({
            element,
            label: 'Project name',
            value: secondItem.name,
          })
        })
      })

      it('should render the status radio buttons', () => {
        cy.get(formSelectors.fields.status).then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Choose a status',
            optionsCount: 3,
            value: 'To do',
          })
        })
      })

      it('Should render the likelihood to export radio buttons', () => {
        cy.get(formSelectors.fields.likelihood).then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Likelihood to export (optional)',
            optionsCount: 3,
            value: 'Medium',
          })
        })
      })

      it('Should render the export sector typeahead', () => {
        cy.get(formSelectors.fields.sector).then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Export sector (optional)',
            value: 'Advanced Engineering',
          })
        })
      })

      it('Should render the company contacts typeahead', () => {
        cy.get(formSelectors.fields.contacts).then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Company contacts (optional)',
            value: 'Dean Cox',
          })
        })
      })

      it('Should render the potential export value input', () => {
        cy.get(formSelectors.fields.value).then((element) => {
          assertFieldInput({
            element,
            label: 'Potential export value (optional)',
            hint: 'Amount in GBP',
            value: 111,
          })
        })
      })

      context('When removing the values', () => {
        before(() => {
          cy.intercept('PATCH', '/api-proxy/v4/pipeline-item/*').as(
            'updatePipelineItem'
          )
        })

        it('should call the api with a null value for each field', () => {
          cy.get(formSelectors.fields.sector).removeAllTypeaheadValues()
          cy.get(formSelectors.fields.contacts).removeAllTypeaheadValues()
          cy.get(formSelectors.value).clear()
          cy.get(formSelectors.fields.expectedWinDate).find('input').clear()

          cy.contains('button', 'Save').click()
          cy.wait('@updatePipelineItem').then((xhr) => {
            expect(xhr.request.body.sector).to.equal(null)
            expect(xhr.request.body.contacts).to.deep.equal([])
            expect(xhr.request.body.potential_value).to.equal(null)
            expect(xhr.request.body.expected_win_date).to.equal(null)
          })
        })
      })
    })
  })

  context(
    'When form is submitted it redirects to the correct tab with a success message',
    () => {
      beforeEach(() => {
        cy.visit(urls.pipeline.edit(firstItem.id))
      })

      it('should redirect to the prospect tab in my pipeline', () => {
        cy.get('input[value=leads').click()
        cy.contains('button', 'Save').click()
        cy.url().should('include', urls.pipeline.index())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You saved changes to TEST'
        )
      })

      it('should redirect to the active tab in my pipeline', () => {
        cy.get('input[value=in_progress').click()
        cy.contains('button', 'Save').click()
        cy.url().should('include', urls.pipeline.active())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You saved changes to TEST'
        )
      })

      it('should redirect to the won tab in my pipeline', () => {
        cy.get('input[value=win').click()
        cy.contains('button', 'Save').click()
        cy.url().should('include', urls.pipeline.won())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You saved changes to TEST'
        )
      })
    }
  )

  context(
    'When cancelling an edit it should link to the pipeline category',
    () => {
      beforeEach(() => {
        cy.visit(urls.pipeline.edit(firstItem.id))
      })

      it('should redirect to the prospect tab in my pipeline', () => {
        cy.visit(urls.pipeline.edit('LEADS'))
        cy.contains('a', 'Cancel').should(
          'have.attr',
          'href',
          urls.pipeline.index()
        )
        cy.contains('a', 'Cancel').click()
        cy.url().should('include', urls.pipeline.index())
      })

      it('should redirect to the active tab in my pipeline', () => {
        cy.visit(urls.pipeline.edit('IN_PROGRESS'))
        cy.contains('a', 'Cancel').should(
          'have.attr',
          'href',
          urls.pipeline.active()
        )
        cy.contains('a', 'Cancel').click()
        cy.url().should('include', urls.pipeline.active())
      })

      it('should redirect to the won tab in my pipeline', () => {
        cy.visit(urls.pipeline.edit('WIN'))
        cy.contains('a', 'Cancel').should(
          'have.attr',
          'href',
          urls.pipeline.won()
        )
        cy.contains('a', 'Cancel').click()
        cy.url().should('include', urls.pipeline.won())
      })
    }
  )
})
