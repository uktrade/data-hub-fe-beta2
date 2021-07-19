const fillOut = (data) => {
  cy.contains('First name').type(data.name)
  cy.contains('Last name').type(data.lastName)
  cy.contains('Job title').type(data.jobTitle)
  cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
  cy.contains('Telephone country code').type(data.countryCode)
  cy.contains('Telephone number').type(data.phone)
  cy.contains('Email').type(data.email)
}

const create = (data) => {
  fillOut(data)
  cy.checkRadioGroup(
    'Is the contact’s address the same as the company address?',
    'Yes'
  )
  cy.getSubmitButtonByLabel('Add contact').click()
}

const createWithNewAddress = (data) => {
  fillOut(data)
  cy.checkRadioGroup(
    'Is the contact’s address the same as the company address?',
    'No'
  )
  cy.contains('Address line 1').type(data.address1)
  cy.contains('Address line 2').type(data.address2)
  cy.contains('Town or city').type(data.city)
  cy.contains('Country').parent().find('select').select(data.country)
  cy.getSubmitButtonByLabel('Add contact').click()
}

module.exports = {
  create,
  createWithNewAddress,
}
