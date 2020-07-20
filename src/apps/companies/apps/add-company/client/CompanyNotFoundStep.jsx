/* eslint-disable camelcase */

import React from 'react'
import { Details } from 'govuk-react'
import PropTypes from 'prop-types'
import { FieldInput, FieldRadios, FieldSelect } from 'data-hub-components'

import Form from '../../../../../client/components/Form'
import FieldAddress from '../../../../../client/components/Form/FieldAddress'
import { ISO_CODE, WEBSITE_REGEX } from './constants'
import InformationList from './InformationList'

const requiredWebsiteAndOrPhoneValidator = (
  value,
  name,
  { values: { website, telephone_number } }
) => {
  if (!telephone_number && !website) {
    return 'Enter a website or phone number'
  }

  if (telephone_number && !website) {
    return null
  }

  // TODO: Move this validation to the component library
  return !WEBSITE_REGEX.test(website) ? 'Enter a valid website URL' : null
}

function CompanyNotFoundStep({
  organisationTypes,
  regions,
  sectors,
  country,
  region = null,
}) {
  return (
    <Form.Step name="unhappy" forwardButton="Add company">
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
        required="Enter name"
        type="text"
      />

      <FieldInput
        label="Company's website"
        name="website"
        type="url"
        validate={requiredWebsiteAndOrPhoneValidator}
      />

      <FieldInput
        label="Company's telephone number"
        name="telephone_number"
        type="tel"
        validate={requiredWebsiteAndOrPhoneValidator}
      />

      <FieldAddress
        name="company_address"
        country={{
          id: country.key,
          name: country.label,
        }}
        apiEndpoint="/api/postcodelookup"
      />

      {country.value === ISO_CODE.UK && (
        <FieldSelect
          name="uk_region"
          label="DIT region"
          initialValue={region?.value}
          emptyOption="-- Select DIT region --"
          options={regions}
          required="Select DIT region"
        />
      )}

      <FieldSelect
        name="sector"
        label="DIT sector"
        emptyOption="-- Select DIT sector --"
        options={sectors}
        required="Select DIT sector"
      />

      <InformationList
        heading="What happens next"
        description="You are requesting that a new company be added to Data Hub. Once you select the ‘Add company’ button below:"
      >
        <InformationList.Item>
          you can continue to record interactions with the company
        </InformationList.Item>
        <InformationList.Item>
          Data Hub’s external data provider will confirm with the company that
          the information on this page is correct
        </InformationList.Item>
        <InformationList.Item>
          within 3 weeks the Data Hub support team will send you an email to
          tell you whether the information on this page has been confirmed
        </InformationList.Item>
      </InformationList>
    </Form.Step>
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
