module.exports = {
  nextButton: 'form button:contains("Next")',
  submitButton: 'form button:contains("Save and continue")',
  backButton: 'form button:contains("Back")',
  subheader: 'form p',
  h3: 'form h3',
  entitySearch: {
    searchButton: 'form button:contains("Search")',
    results: {
      someCompanyName: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
    },
  },
  companyDetails: {
    subheader: 'form h2',
  },
}
