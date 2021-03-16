import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import urls from '../../../../../lib/urls'
import CompanyMatched from './CompanyMatched'
import CompanyUnmatched from './CompanyUnmatched'
import {
  StatusMessage,
  FormStateful,
  FormActions,
} from '../../../../../client/components'

function EditCompanyForm({
  csrfToken,
  company,
  formInitialValues,
  turnoverRanges,
  employeeRanges,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  isOnOneList,
  features,
}) {
  async function onSubmit(values, isPristine) {
    if (isPristine) {
      // The user has not made any changes so redirect
      // back to the Business Details page.
      return urls.companies.businessDetails(company.id)
    }

    // The user has made some changes so make an API call
    await axios.post(urls.companies.edit(company.id), values, {
      params: { _csrf: csrfToken },
    })
    return urls.companies.businessDetails(company.id)
  }

  // TODO: Support nested form values to avoid transformation
  return (
    <FormStateful onSubmit={onSubmit} initialValues={formInitialValues}>
      {({ submissionError }) => (
        <>
          {submissionError && (
            <StatusMessage>
              Company details could not be saved, try again later.{' '}
              {submissionError.message}
            </StatusMessage>
          )}

          {company.duns_number ? (
            <CompanyMatched
              company={company}
              isOnOneList={isOnOneList}
              regions={regions}
              headquarterTypes={headquarterTypes}
              oneListEmail={oneListEmail}
              sectors={sectors}
            />
          ) : (
            <CompanyUnmatched
              company={company}
              isOnOneList={isOnOneList}
              regions={regions}
              employeeRanges={employeeRanges}
              headquarterTypes={headquarterTypes}
              oneListEmail={oneListEmail}
              sectors={sectors}
              turnoverRanges={turnoverRanges}
              features={features}
            />
          )}

          <FormActions>
            <Button>Submit</Button>
            <Link href={urls.companies.businessDetails(company.id)}>
              Return without saving
            </Link>
          </FormActions>
        </>
      )}
    </FormStateful>
  )
}

EditCompanyForm.propTypes = {
  isOnOneList: PropTypes.bool.isRequired,
  csrfToken: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
  formInitialValues: PropTypes.object.isRequired,
  turnoverRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  employeeRanges: PropTypes.arrayOf(
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
  headquarterTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  oneListEmail: PropTypes.string.isRequired,
}

export default EditCompanyForm
