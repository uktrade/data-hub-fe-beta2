/* eslint-disable camelcase */

import React from 'react'
import { connect } from 'react-redux'
import { Details } from 'govuk-react'
import PropTypes from 'prop-types'
import { LoadingBox } from 'govuk-react'
import { FieldInput, FieldRadios, FieldSelect, Step } from 'data-hub-components'
import FieldAddress from 'data-hub-components/dist/forms/elements/FieldAddress'

import Task from '../../../../../client/components/Task'
import { ID, TASK_POSTCODE_TO_REGION } from './state'
import { ISO_CODE, WEBSITE_REGEX } from './constants'
import InformationList from './InformationList'
import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'

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
  region,
}) {
  return (
    <Step name="unhappy" forwardButton="Add company">
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

      <Task>
        {(getTask) => {
          const task = getTask(TASK_POSTCODE_TO_REGION, ID)
          return (
            <>
              <FieldAddress
                name="address"
                country={{
                  id: country.key,
                  name: country.label,
                }}
                apiEndpoint="/api/postcodelookup"
                onSelectUKAddress={({ postcode }) => {
                  if (postcode === region?.postcode) {
                    // Avoids repeating API calls
                    // containing the same postcode.
                    return
                  }
                  task.start({
                    payload: postcode,
                    onSuccessDispatch: ADD_COMPANY__REGION_LOADED,
                  })
                }}
              />

              {country.value === ISO_CODE.UK && (
                <LoadingBox loading={task.progress}>
                  <FieldSelect
                    name="uk_region"
                    label="DIT region"
                    initialValue={region?.value}
                    emptyOption="-- Select DIT region --"
                    options={regions}
                    required="Select DIT region"
                  />
                </LoadingBox>
              )}
            </>
          )
        }}
      </Task>

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
  region: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

CompanyNotFoundStep.defaultProps = {
  region: null,
}

export default connect(({ addCompany }) => {
  const { region } = addCompany
  return {
    region,
  }
}, null)(CompanyNotFoundStep)
