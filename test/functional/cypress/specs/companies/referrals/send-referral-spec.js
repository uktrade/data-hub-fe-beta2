const urls = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldTypeahead,
  assertFieldTextarea,
} = require('../../../support/assertions')

const selectTypeahead = (field, input) =>
  cy.get(field).within(() => {
    cy.intercept('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

const enterAdviserDefault = () =>
  selectTypeahead(selectors.sendReferral.adviserField, 'shawn')

const enterSubjectDefault = () =>
  cy.get(selectors.sendReferral.subjectField).click().type('Example subject')

const enterNotesDefault = () =>
  cy.get(selectors.sendReferral.notesField).click().type('Example notes')

const enterContactDefault = () =>
  selectTypeahead(selectors.sendReferral.contactField, 'johnny')

describe('Send a referral form', () => {
  before(() => {
    cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
  })

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
    })

    context('when viewing the "send referral" form', () => {
      it('should display breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          'Venus Ltd': urls.companies.detail(fixtures.company.withContacts.id),
          'Send a referral': null,
        })
      })

      it('should display the header', () => {
        assertLocalHeader('Send a referral')
      })

      it('should display guidance on sending a referral', () => {
        cy.get('h2')
          .contains('When to send a referral')
          .next()
          .should(
            'have.text',
            'Referrals are for when you want to ask another DIT advisor to help out an account you are working on.Read more guidance here (opens in a new window or tab)'
          )
          .find('a')
          .should(
            'have.attr',
            'href',
            'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/improving-collaboration-internal-referrals/'
          )
      })

      it('should display the headings and four fields', () => {
        cy.contains('Who do you want to refer this company to?').should(
          'be.visible'
        )

        cy.get(selectors.sendReferral.adviserField).then((element) => {
          return assertFieldTypeahead({
            element,
            label: 'Adviser',
            placeholder: 'Search for an adviser',
            hint: "This can be an adviser at post, a sector specialist or an international trade advisor. If you're not sure, you can find the right team and person on Digital Workspace (opens in a new window or tab).",
          })
        })

        cy.contains('Referral notes').should('be.visible')

        enterSubjectDefault()

        cy.get(selectors.sendReferral.notesField).then((element) => {
          return assertFieldTextarea({
            element,
            label: 'Notes',
            hint: "Include reasons you're referring this company and any specific opportunities.",
          })
        })

        cy.get(selectors.sendReferral.contactField).then((element) => {
          return assertFieldTypeahead({
            element,
            label: 'Company contact (optional)',
            placeholder: 'Select a contact',
            hint: 'Who should the recipient of the referral talk to? If the contact you are looking for is not listed you can add a new contact.',
          })
        })
      })

      it('should display "Continue" button', () => {
        cy.contains('button', 'Continue').should('be.visible')
      })

      it('should display "Cancel" link', () => {
        cy.contains('a', 'Cancel').should('be.visible')
      })
    })

    context('When the "Cancel" link is clicked', () => {
      it('should return to the company page', () => {
        cy.contains('a', 'Cancel').click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
      })
    })

    context(
      'when "Continue" button is clicked without filling in mandatory fields',
      () => {
        it('should display two error messages', () => {
          cy.contains('button', 'Continue').click()
          cy.get('form')
            .should('contain', 'Select an adviser for the referral')
            .and('contain', 'Enter a subject for the referral')
            .and('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without chosing an adviser',
      () => {
        it('should display error message', () => {
          enterSubjectDefault()
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Select an adviser for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          enterAdviserDefault()
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying notes',
      () => {
        it('should display error message', () => {
          enterAdviserDefault()
          enterSubjectDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when more than 255 characters are entered in the subject field',
      () => {
        it('should display error message', () => {
          cy.get(selectors.sendReferral.subjectField)
            .click()
            .type(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec interdum velit. Nulla facilisi. In ultricies sed ex at malesuada. Proin quis faucibus felis, iaculis malesuada sem. Maecenas semper elit magna, tincidunt consectetur risus volutpat at. Sed'
            )
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
        })
      }
    )
  })

  context(
    'when "Continue" button is clicked with just mandatory fields filled in',
    () => {
      it('should display confirmation component', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('Check referral details').should('be.visible')
      })
    }
  )

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('should display the confirmation component with the values just input', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('Check referral details').should('be.visible')
        cy.get('table')
          .should('contain', 'Shawn Cohen')
          .and('contain', 'Example subject')
          .and('contain', 'Example notes')
          .and('contain', 'Johnny Cakeman')
          .parents()
          .find('button')
          .should('contain', 'Edit Referral')
          .next()
          .should('contain', 'What happens next')
          .next()
          .find('li')
          .eq(0)
          .should(
            'contain',
            "You won't be able to edit the referral after this point"
          )
          .next()
          .should(
            'contain',
            "A link to the referral will appear on the company record, your homepage and the recipient's homepage"
          )
          .next()
          .should('contain', 'The referral might take 24 hours to appear')
          .parents()
          .next()
          .find('button')
          .should('contain', 'Send referral')
          .next()
          .should('contain', 'Cancel')
      })
    }
  )

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('the input data should appear in the form when "Edit Referral" is clicked', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('Edit Referral').click()
        cy.get(selectors.sendReferral.adviserField).should(
          'contain',
          'Shawn Cohen'
        )
        cy.get(selectors.sendReferral.subjectFieldInput).should(
          'have.attr',
          'value',
          'Example subject'
        )
        cy.get(selectors.sendReferral.notesField).should(
          'contain',
          'Example notes'
        )
        cy.get(selectors.sendReferral.contactField).should(
          'contain',
          'Johnny Cakeman'
        )
      })
    }
  )

  context(
    'When the "Cancel" link is clicked from the confirmation component',
    () => {
      it('should return to the company page', () => {
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('Cancel').click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
      })
    }
  )

  context(
    'When the "Send referral" button is clicked from the confirmation component',
    () => {
      before(() => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
      })
      it('should take user to the company page, display flash message and link to the homepage', () => {
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('button', 'Send referral').click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
        cy.get(selectors.companyLocalHeader().flashMessageList).contains(
          'Referral sent'
        )
        cy.contains('You can see all of your referrals on your Homepage.')
          .contains('see all of your referrals on your Homepage')
          .should('have.attr', 'href', urls.companies.referrals.list())
      })
    }
  )
})

describe('Contact loop', () => {
  context('when a contact does not exist and user wants to add one', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the interaction form after the contact is added', () => {
      cy.get(selectors.sendReferral.subjectField)
        .click()
        .type('Test if values are restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.companies.referrals.send(fixtures.company.withContacts.id)
      )

      cy.contains('div', 'First name').find('input').type('John')
      cy.contains('div', 'Last name').find('input').type('Doe')
      cy.contains('div', 'Job title').find('input').type('Full-stack dev')
      cy.contains('fieldset', 'Is this person a primary contact?')
        .contains('label', 'Yes')
        .click()
      cy.contains('div', 'Telephone country code').find('input').type('+44')
      cy.contains('div', 'Telephone number').find('input').type('123 567 789')
      cy.contains('div', 'Email').find('input').type('john@example.com')
      cy.contains(
        'fieldset',
        'Is the contact’s address the same as the company address?'
      )
        .contains('label', 'Yes')
        .click()
      cy.contains('button', 'Add contact').click()

      cy.url().should(
        'include',
        urls.companies.referrals.send(fixtures.company.withContacts.id)
      )
      cy.contains(
        'You added Json Russel.You can now continue sending the referral.'
      )

      cy.get(selectors.sendReferral.subjectFieldInput).should(
        'have.attr',
        'value',
        'Test if values are restored'
      )
    })
  })
})
