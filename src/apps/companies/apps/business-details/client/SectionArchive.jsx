import { omit } from 'lodash'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import axios from 'axios'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const SectionArchive = ({ isArchived, isDnbCompany, urls }) => {
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  const archiveSubmitCallback = async (values) => {
    setIsLoading(true)
    await axios({
      method: 'POST',
      url: urls.companyArchive,
      data: values,
    })
    window.location.href = urls.companyBusinessDetails
  }

  return (
    <div data-auto-id="archiveCompanyContainer">
      <StyledSectionHeader>Archive company</StyledSectionHeader>

      <p>Archive this company if it is no longer required or active.</p>

      {formIsOpen && (
        <LoadingBox loading={isLoading}>
          <ValidatedForm
            id="business-details"
            submitLabel="Archive"
            secondaryActions={[
              { children: 'Cancel', onClick: () => setFormIsOpen(false) },
            ]}
            onSubmit={(e, values) => {
              e.preventDefault()
              archiveSubmitCallback(values)
            }}
            validators={{
              archived_reason: (x) => !x && 'Select a reason',
              archived_reason_other: (x, { archived_reason }) =>
                archived_reason === 'Other' && !x
                  ? 'Describe the other reason'
                  : false,
            }}
          >
            {({ getField }) => (
              <RadioField
                {...getField('archived_reason')}
                options={{
                  'Company is dissolved': {
                    value: 'Company is dissolved',
                  },
                  Other: {
                    value: 'Other',
                    inset: (
                      <InputField
                        label="Other"
                        {...omit(getField('archived_reason_other'), 'onChange')}
                      />
                    ),
                  },
                }}
              />
            )}
          </ValidatedForm>
        </LoadingBox>
      )}
      {!formIsOpen && (
        <Button
          onClick={() => setFormIsOpen(true)}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
        >
          Archive
        </Button>
      )}
    </div>
  )
}

SectionArchive.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionArchive
