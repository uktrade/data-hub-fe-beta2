describe('home page', () => {
  before(() => {
    cy.visit('/')
  })

  it('content', () => {
    cy.get('.dashboard-section__info-feed-date').hideElement()
    cy.get('.grid-row').compareSnapshot('homePageContent')
  })

  it('header', () => {
    cy.get('.datahub-header').compareSnapshot('homePageHeader')
  })

  it('search bar', () => {
    cy.get('.govuk-grid-column-full')
      .first()
      .compareSnapshot('homePageSearchBar')
  })
})
