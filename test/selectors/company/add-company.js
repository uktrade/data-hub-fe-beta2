module.exports = {
  title: 'h1',
  form: 'form',
  continueButton: 'form button:contains("Continue")',
  submitButton: 'form button:contains("Add company")',
  backButton: 'form button:contains("Back")',
  subheader: 'form p',
  stepHeader: 'form h3',
  summary: 'form dl',
  regionSelect: 'form select#uk_region',
  sectorSelect: 'form select#sector',
  entitySearch: {
    companyNameField: 'input[name="dnbCompanyName"]',
    postalCodeField: 'input[name="dnbPostalCode"]',
    searchButton: 'form button:contains("Find company")',
    results: {
      someCompanyName: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
      companyUnknownPostcode: 'form ol li:nth-child(3)',
    },
    cannotFind: {
      summary: 'details summary span',
      stillCannotFind: `button:contains("I still can't find what I'm looking for")`,
    },
  },
  newCompanyRecordForm: {
    whyAmISeeingThis: {
      summary: 'details summary span',
    },
    organisationType: {
      charity: 'label:contains("Charity") input[type="radio"]',
      governmentDepartmentOrOtherPublicBody:
        'label:contains("Government department or other public body") input[type="radio"]',
      limitedCompany: 'label:contains("Limited company") input[type="radio"]',
      limitedPartnership:
        'label:contains("Limited partnership") input[type="radio"]',
      partnership: 'label:contains("Partnership") input[type="radio"]',
      soleTrader: 'label:contains("Sole Trader") input[type="radio"]',
    },
    companyName: 'input[name="name"]',
    website: 'input[name="website"]',
    telephone: 'input[name="telephone_number"]',
    address: {
      postcode: 'input[name="postcode"]',
      findUkAddress: 'form button:contains("Find UK address")',
      options: 'label:contains("Select an address") select',
    },
    region: 'select#uk_region',
    sector: 'select#sector',
  },
  companyDetails: {
    subheader: 'form h2',
  },
}
