/* eslint-disable camelcase */

import React from 'react'
import { Details } from 'govuk-react'
import PropTypes from 'prop-types'

import {
  Step,
  FieldInput,
  FieldRadios,
  FieldAddress,
} from '../../../../../client/components'

import {
  WEBSITE_REGEX,
  NON_ASCII_REGEX,
  GENERIC_PHONE_NUMBER_REGEX,
  CSV_FORMULA_INJECTION_REGEX,
} from './constants'

const websiteValidator = (
  value,
  name,
  { values: { website, telephone_number } }
) => {
  if (!website && !telephone_number) {
    return 'Enter a website or phone number'
  } else if (website && !WEBSITE_REGEX.test(website)) {
    return 'Enter a valid website URL'
  }
  return null
}

const telephoneValidator = (
  value,
  name,
  { values: { website, telephone_number } }
) => {
  if (!website && !telephone_number) {
    return 'Enter a website or phone number'
  } else if (
    telephone_number &&
    (!GENERIC_PHONE_NUMBER_REGEX.test(telephone_number) ||
      NON_ASCII_REGEX.test(telephone_number))
  ) {
    return 'Enter a valid telephone number'
  }
  return null
}

const nameValidator = (value) => {
  return !value
    ? 'Enter name'
    : CSV_FORMULA_INJECTION_REGEX.test(value)
    ? 'Enter a valid name'
    : null
}
function CompanyNotFoundStep({ organisationTypes, country }) {
  return (
    <Step name="unhappy">
      <Details summary="Why am I seeing this?">
        The company you want to add to Data Hub cannot be found in the external
        databases Data Hub checks. You will need to provide information about
        the company, so the company can be added to Data Hub while the Data Hub
        support team checks with the company the information you have provided.
      </Details>

      <FieldRadios
        name="business_type"
        label="Organisation type"
        required="Select organisation type"
        options={organisationTypes}
      />

      <FieldInput
        label="Name of company"
        name="name"
        type="text"
        validate={nameValidator}
      />

      <FieldInput
        label="Company's website"
        name="website"
        type="url"
        validate={websiteValidator}
      />

      <FieldInput
        label="Company's telephone number"
        name="telephone_number"
        type="tel"
        validate={telephoneValidator}
      />

      <FieldAddress
        country={{
          id: country.key,
          name: country.label,
        }}
        apiEndpoint="/api/postcodelookup"
      />
    </Step>
  )
}

CompanyNotFoundStep.propTypes = {
  organisationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  country: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

export default CompanyNotFoundStep
