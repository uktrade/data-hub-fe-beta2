import React from 'react'
import PropTypes from 'prop-types'
import Paragraph from '@govuk-react/paragraph'

import {
  FieldAddress,
  FieldInput,
  FieldSelect,
  FieldWrapper,
} from '../../../../../client/components'
import { WEBSITE_REGEX } from '../../add-company/client/constants'
import { export_segments, export_sub_segments } from './constants'

const websiteValidator = (value) =>
  value && !WEBSITE_REGEX.test(value) ? 'Enter a valid website URL' : null

const CommonFields = ({ company, regions, features }) => (
  <>
    <FieldInput
      label="Trading name (optional)"
      name="trading_names"
      type="text"
    />

    {company.uk_based && (
      <FieldInput label="VAT number (optional)" name="vat_number" type="text" />
    )}

    <FieldInput
      label="Website (optional)"
      name="website"
      type="url"
      validate={websiteValidator}
    />

    <FieldInput
      label="Business description (optional)"
      name="description"
      type="text"
    />

    <FieldSelect
      name="export_segment"
      label="Export Segment (optional)"
      emptyOption="No export segment or not known"
      options={export_segments}
    />

    <FieldSelect
      name="export_sub_segment"
      label="Export Sub-segment (optional)"
      emptyOption="No sub export segment or not known"
      options={export_sub_segments}
    />

    <FieldAddress
      legend="Address"
      name="address"
      hint="This should be the address for this particular office of the
         business. If you need to record activity or a contact for a different
          address, please add a new company record to Data Hub."
      country={company?.address?.country ?? {}}
      apiEndpoint="/api/postcodelookup"
      features={features}
    />

    {company.registered_address && (
      <FieldWrapper
        name="registered_address"
        legend="Registered address"
        showBorder={true}
      >
        <Paragraph>
          {company.uk_based
            ? 'A registered office address is a legal requirement of all' +
              ' limited companies and Limited Liability Partnerships (LLPs)' +
              ' incorporated in the UK. Its purpose is to provide Companies' +
              ' House, HMRC and other relevant government bodies with an' +
              ' official address for delivering statutory mail and legal' +
              ' notices.'
            : 'A registered office address is the official address of' +
              ' an incorporated company or any other legal entity. Its' +
              ' purpose is to provide an official address for delivering' +
              ' statutory mail and legal notices.'}
        </Paragraph>

        {company.registered_address.line_1 && (
          <div>{company.registered_address.line_1}</div>
        )}
        {company.registered_address.line_2 && (
          <div>{company.registered_address.line_2}</div>
        )}
        {company.registered_address.town && (
          <div>{company.registered_address.town}</div>
        )}
        {company.registered_address.county && (
          <div>{company.registered_address.county}</div>
        )}
        {company.registered_address.postcode && (
          <div>{company.registered_address.postcode}</div>
        )}
        {company.registered_address.country && (
          <div>{company.registered_address.country.name}</div>
        )}
      </FieldWrapper>
    )}

    {company.uk_based && (
      <FieldSelect
        name="uk_region"
        label="DIT region"
        emptyOption="-- Select DIT region --"
        options={regions}
        required="Select DIT region"
      />
    )}
  </>
)

CommonFields.propTypes = {
  company: PropTypes.object.isRequired,
}

export default CommonFields
