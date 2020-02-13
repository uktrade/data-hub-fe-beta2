/* eslint-disable camelcase */

import React from 'react'
import { compact, get } from 'lodash'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import { Step, SummaryList, useFormContext } from 'data-hub-components'

function getCompanyAddress(dnbCompany) {
  if (dnbCompany) {
    return compact([
      dnbCompany.address_line_1,
      dnbCompany.address_line_2,
      dnbCompany.address_town,
      dnbCompany.address_postcode,
    ]).join(', ')
  }
}

function getCompaniesHouseNumber(dnbCompany) {
  if (dnbCompany) {
    const companiesHouseAccount = dnbCompany.registration_numbers.find(
      ({ registration_type }) =>
        registration_type === 'uk_companies_house_number'
    )

    if (companiesHouseAccount) {
      return companiesHouseAccount.registration_number
    }
  }
}

function CompanyFoundStep({ countryName }) {
  const { values } = useFormContext()

  const dnbCompany = get(values, 'dnbCompany')
  const companyName = get(dnbCompany, 'primary_name')
  const companyAddress = getCompanyAddress(dnbCompany)
  const companiesHouseNumber = getCompaniesHouseNumber(dnbCompany)

  return (
    <Step name="companyDetails">
      <H3>Confirm you want to add this company to Data Hub</H3>

      <InsetText>
        <SummaryList
          rows={[
            {
              label: 'Registered company name',
              value: companyName,
            },
            {
              label: 'Companies House number',
              value: companiesHouseNumber,
            },
            {
              label: 'Country',
              value: countryName,
            },
            {
              label: 'Address',
              value: companyAddress,
            },
          ]}
        />
      </InsetText>
    </Step>
  )
}

CompanyFoundStep.propTypes = {
  countryName: PropTypes.string,
}

export default CompanyFoundStep
