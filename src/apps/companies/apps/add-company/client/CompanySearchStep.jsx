/* eslint-disable camelcase */

import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { H3 } from '@govuk-react/heading'
import { EntityListItem, useFormContext } from 'data-hub-components'

import Form from '../../../../../client/components/Form'
import FieldDnbCompany from '../../../../../client/components/Form/FieldDnbCompany'

function DnbCompanyRenderer(props) {
  const { setFieldValue, goForward } = useFormContext()

  function onEntityClick({ dnb_company }) {
    setFieldValue('cannotFind', false)
    setFieldValue('dnbCompany', dnb_company)
    goForward()
  }

  const { data } = props
  const companyId = get(data, 'datahub_company.id')
  const isOutOfBusiness = get(data, 'dnb_company.is_out_of_business')
  const isClickable = !companyId && !isOutOfBusiness

  return (
    <EntityListItem
      onEntityClick={isClickable ? onEntityClick : null}
      text={getDnbEntityText(companyId, isOutOfBusiness)}
      {...props}
    />
  )
}

function getDnbEntityText(companyId, isOutOfBusiness) {
  if (isOutOfBusiness) {
    return 'This company has stopped trading and is no longer in business.'
  }

  if (companyId) {
    return (
      <>
        This company is already on Data Hub.{' '}
        <Link href={`/companies/${companyId}`}>Go to the company page</Link> to
        record activity.
      </>
    )
  }

  return null
}

function CompanySearchStep({ countryName, countryIsoCode, csrfToken }) {
  const { setFieldValue, goForward } = useFormContext()
  return (
    <Form.Step name="companySearch" forwardButton={null} backButton={null}>
      <H3>Find the company</H3>

      <FieldDnbCompany
        apiEndpoint={`/companies/create/dnb/company-search?_csrf=${csrfToken}`}
        queryParams={{ address_country: countryIsoCode }}
        name="dnbCompany"
        country={countryName}
        entityRenderer={DnbCompanyRenderer}
        onCannotFind={() => {
          setFieldValue('cannotFind', true)
          goForward()
        }}
      />
    </Form.Step>
  )
}

CompanySearchStep.propTypes = {
  countryName: PropTypes.string.isRequired,
  countryIsoCode: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default CompanySearchStep
