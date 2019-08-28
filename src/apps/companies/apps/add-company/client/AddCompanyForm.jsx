/* eslint-disable */

import React, { useState } from 'react'
import { Details, LoadingBox } from 'govuk-react'
import { Form, Step } from 'data-hub-components'

import EntitySearchWithDataProvider from 'data-hub-components/dist/entity-search/EntitySearchWithDataProvider'
import dnbCompanySearchDataProvider from 'data-hub-components/dist/entity-search/data-providers/DnbCompanySearch'

function AddCompanyForm(props) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function submitCallback() {
    setIsSubmitting(true)
    await timeout(1000)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p>Form submitted, thank you.</p>
    )
  }

  return (
    <Form {...props} onSubmit={submitCallback}>
      <LoadingBox loading={isSubmitting}>
        <Step name="companyType">
          <p>Companies</p>
        </Step>

        <Step name="companySearch" hideBackButton={true} hideForwardButton={true}>
          <h2>Find the company</h2>

          <EntitySearchWithDataProvider
            getEntities={dnbCompanySearchDataProvider(`http://localhost:3000/companies/create/blah?_csrf=${props.csrfToken}`)}
            entityFilters={[
              [
                { label: 'Company name', key: 'search_term' },
              ],
              [
                { label: 'Company postcode', key: 'address_postcode', width: 'one-half' },
              ],
            ]}
            cannotFind={{
              summary: 'I cannot find the company I am looking for',
              actions: [
                'Check the country selected is correct',
                'Check for spelling errors in the company name',
                'Remove or add Ltd or Limited to your search',
              ],
              link: {
                text: 'I still cannot find the company',
                url: 'http://stillcannotfind.com',
              },
            }}
            onEntityClick={(entity) => {
              if (!entity.datahub_company) {
                alert(`Selected ${JSON.stringify(entity)}`)
              }
            }}
          />

        </Step>

        <Step name="companyDetails" forwardButtonText={"Add company"}>
          <p>Add company details</p>

          <Details summary="Why am I seeing this?">
            The company you want to add to Data Hub cannot be found
            in the external databases Data Hub checks.
            You will need to provide information about the company,
            so the company can be added to Data Hub
            while the Data Hub support team checks with the company
            the information you have provided.
          </Details>
        </Step>
      </LoadingBox>
    </Form>
  )
}

AddCompanyForm.propTypes = Form.propTypes
AddCompanyForm.defaultProps = Form.defaultProps

export default AddCompanyForm
