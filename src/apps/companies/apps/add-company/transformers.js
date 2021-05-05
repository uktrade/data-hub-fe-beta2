/* eslint-disable camelcase */
const transformFormData = (
  {
    name,
    website,
    telephone_number,
    address1,
    address2,
    city,
    county,
    postcode,
    country,
    area,
  },
  countryAsObject = true
) => {
  return {
    name,
    website,
    telephone_number,
    address: {
      line_1: address1,
      line_2: address2 || '',
      town: city,
      county: county || '',
      postcode: postcode,
      country: countryAsObject ? { id: country } : country,
      area: area,
    },
  }
}

const transformToDnbStubCompany = (formData) => {
  return {
    ...transformFormData(formData),
    business_type: formData.business_type,
    uk_region: formData.uk_region,
    sector: formData.sector,
  }
}

const transformToCreateDnbCompanyInvestigation = (formData, companyId) => {
  return {
    ...transformFormData(formData, false),
    company: companyId,
  }
}

module.exports = {
  transformToDnbStubCompany,
  transformToCreateDnbCompanyInvestigation,
}
