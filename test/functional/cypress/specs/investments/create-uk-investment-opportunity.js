it('Create UK Investment Opportunity page', () => {
  cy.visit('/investments/opportunities/create')

  cy.findByText('There is a problem').should('not.exist')
  cy.findByText('Enter an opportunity name').should('not.exist')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.findByText('There is a problem').should('exist')
  cy.findAllByText('Enter an opportunity name').should('exist')

  cy.findByText('Opportunity name').type('Foooo{enter}')
  cy.url().should(
    'eq',
    `${
      Cypress.config().baseUrl
    }/investments/opportunities/new-large-capital-uk-opportunity-id/details`
  )
})
