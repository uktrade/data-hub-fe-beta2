/// <reference types="Cypress" />

const { assertBreadcrumbs } = require('../../support/assertions')

const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const NEW_CONTACT_ID = '14890695-ce54-4419-88d3-9224754ecbc0'

const submit = () => cy.get('form').contains('Add contact').click()

const assertErrorSummary = (...errors) =>
  cy
    .contains('There is a problem')
    .parent()
    .within(() =>
      cy
        .get('ul')
        .within(() =>
          errors.forEach((message, i) =>
            cy.get('li').eq(i).should('have.text', message)
          )
        )
    )

const assertError = (label, error) =>
  cy.contains(label).parent().contains(error)

const assertErrors = (errors) => {
  assertErrorSummary(...Object.values(errors))
  Object.entries(errors).forEach(([k, v]) => assertError(k, v))
}

const assertInputValueByLabel = (label, value) =>
  cy.contains(label).parent().find('input').should('have.value', value)

const assertInputValuesByLabels = (labelValueMap) =>
  Object.entries(labelValueMap).forEach(([label, value]) =>
    assertInputValueByLabel(label, value)
  )

const assertRadioGroup = (label, option) =>
  cy
    .contains(label)
    .parent()
    .find(`[aria-label="${option}"]`)
    .should('be.checked')

const assertRadioGroupNoOptionChecked = (label) =>
  cy.contains(label).parent().find('input').should('not.be.checked')

const assertNoMarketingConsent = () =>
  cy
    .contains('The company contact does accept email marketing')
    .parent()
    .find('input')
    .should('not.be.checked')

const checkRadio = (label, option) =>
  cy.contains(label).parent().find(`[aria-label="${option}"]`).check()

const typeIntoInput = (label, text) => cy.contains(label).type(text)

const typeIntoInputs = (labelValueMap) =>
  Object.entries(labelValueMap).forEach(([k, v]) => typeIntoInput(k, v))

describe('Create contact form', () => {
  beforeEach(() => {
    cy.visit(`/contacts/create?company=${ZBONCAK_COMPANY_ID}`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Add contact at Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': null,
    })

    assertNoMarketingConsent()

    assertRadioGroupNoOptionChecked('Is this person a primary contact?')
    assertRadioGroupNoOptionChecked(
      'Is the contact’s address the same as the company address?'
    )

    assertInputValuesByLabels({
      'First name': '',
      'Last name': '',
      'Job title': '',
      'Telephone country code': '',
      'Telephone number': '',
      Email: '',
      'Alternative telephone number (optional)': '',
      'Alternative email (optional)': '',
    })
  })

  it('Should show errors when submitted empty', () => {
    checkRadio(
      'Is the contact’s address the same as the company address?',
      'No'
    )

    submit()

    assertErrors({
      'First name': 'This field may not be null.',
      'Last name': 'This field may not be null.',
      'Job title': 'This field may not be null.',
      'Is this person a primary contact?': 'This field is required.',
      'Telephone country code': 'This field may not be null.',
      'Telephone number': 'This field may not be null.',
      Email: 'This field may not be null.',
      Postcode: 'Enter postcode',
      'Address line 1': 'Enter address line 1',
      'Town or city': 'Enter town or city',
    })
  })

  it('Should show errors for invalid field values', () => {
    checkRadio(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )
    checkRadio('Is this person a primary contact?', 'Yes')

    typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Telephone country code': '12345',
      'Telephone number': '12345',
      Email: 'foo',
    })

    submit()

    assertErrors({
      'Telephone country code':
        'Country code should consist of one to four numbers',
      Email: 'Enter a valid email address',
    })
  })

  it('Should redirect to the new contact page when required fields are filled out', () => {
    checkRadio('Is this person a primary contact?', 'Yes')
    checkRadio(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )

    typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Telephone country code': '1234',
      'Telephone number': '456789',
      Email: 'andy@little.britain.co.uk',
    })

    submit()

    cy.location('pathname').should('eq', `/contacts/${NEW_CONTACT_ID}/details`)
  })
})

describe('Edit contact', () => {
  it('Should render the form with the contact values', () => {
    cy.visit(`/contacts/${NEW_CONTACT_ID}/edit`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Joseph Woof': null,
      Edit: null,
    })

    cy.contains('Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978').should(
      'have.attr',
      'href',
      `/companies/${ZBONCAK_COMPANY_ID}`
    )

    assertNoMarketingConsent()

    assertRadioGroup('Is this person a primary contact?', 'Yes')
    assertRadioGroup(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )

    assertInputValuesByLabels({
      'First name': 'Joseph',
      'Last name': 'Woof',
      'Job title': 'Dog master',
      'Telephone country code': '222',
      'Telephone number': '3453454',
      Email: 'contact@bob.com',
      'Alternative telephone number (optional)': '',
      'Alternative email (optional)': '',
    })
  })
})
