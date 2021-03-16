/**
 * Functional tests: ./test/functional/cypress/specs/companies/add-company-spec.js
 */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { get } from 'lodash'

import {
  FieldRadios,
  FieldSelect,
  FormStateful,
  Step,
} from '../../../../../client/components'

import CompanyFoundStep from './CompanyFoundStep'
import CompanyNotFoundStep from './CompanyNotFoundStep'
import CompanySearchStep from './CompanySearchStep'
import CompanyRegionAndSector from './CompanyRegionAndSector'
import InformationList from './InformationList'
import { ISO_CODE } from './constants'

function AddCompanyForm({
  csrfToken,
  countries,
  organisationTypes,
  regions,
  sectors,
}) {
  const optionCountryUK = countries.find(({ value }) => value === ISO_CODE.UK)
  const overseasCountries = countries.filter(
    ({ value }) => value && value !== ISO_CODE.UK
  )

  const COMPANY_LOCATION_OPTIONS = {
    uk: optionCountryUK,
    overseas: {
      label: 'Overseas',
      value: 'overseas',
      children: (
        <FieldSelect
          required="Select in which country the company is located"
          emptyOption="-- Select country --"
          label="Country"
          name="companyOverseasCountry"
          options={overseasCountries}
        />
      ),
    },
  }

  function getCountry({ companyLocation, companyOverseasCountry }) {
    if (
      companyLocation &&
      companyLocation === COMPANY_LOCATION_OPTIONS.uk.value
    ) {
      return COMPANY_LOCATION_OPTIONS.uk
    }

    if (companyOverseasCountry) {
      return overseasCountries.find((c) => c.value === companyOverseasCountry)
    }

    return {}
  }

  async function onSubmit(values) {
    const path = values.cannotFind ? 'company-investigation' : 'company-create'
    const postUrl = `/companies/create/dnb/${path}?_csrf=${csrfToken}`
    const { data } = await axios.post(postUrl, values)
    return `/companies/${data.id}`
  }

  return (
    <FormStateful
      onSubmit={onSubmit}
      onExit={() => 'Changes that you made will not be saved.'}
    >
      {({ values, setFieldValue }) => {
        const country = getCountry(values)
        const countryID = get(country, 'key')
        const countryName = get(country, 'label')
        const countryIsoCode = get(country, 'value')
        const postcode = get(values.dnbCompany, 'address_postcode')
        const manualPostcode = values.postcode

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          setFieldValue('country', countryID)
        }, [countryID])

        return (
          <>
            <Step name="companyLocation">
              <FieldRadios
                name="companyLocation"
                legend="Where is this company located?"
                required="Specify location of the company"
                options={Object.values(COMPANY_LOCATION_OPTIONS)}
                bigLegend={true}
              />
            </Step>

            <CompanySearchStep
              countryName={countryName}
              countryIsoCode={countryIsoCode}
              csrfToken={csrfToken}
            />

            {!values.cannotFind && (
              <CompanyFoundStep countryName={countryName} />
            )}

            {!values.cannotFind && (
              <CompanyRegionAndSector
                regions={regions}
                sectors={sectors}
                isUK={country.value === ISO_CODE.UK}
                postcode={postcode}
              />
            )}

            {values.cannotFind && (
              <CompanyNotFoundStep
                organisationTypes={organisationTypes}
                country={country}
              />
            )}
            {values.cannotFind && (
              <CompanyRegionAndSector
                regions={regions}
                sectors={sectors}
                isUK={country.value === ISO_CODE.UK}
                postcode={manualPostcode}
              >
                <InformationList
                  heading="What happens next"
                  description="You are requesting that a new company be added to Data Hub. Once you select the ‘Add company’ button below:"
                >
                  <InformationList.Item>
                    you can continue to record interactions with the company
                  </InformationList.Item>
                  <InformationList.Item>
                    Data Hub’s external data provider will confirm with the
                    company that the information on this page is correct
                  </InformationList.Item>
                  <InformationList.Item>
                    within 3 weeks the Data Hub support team will send you an
                    email to tell you whether the information on this page has
                    been confirmed
                  </InformationList.Item>
                </InformationList>
              </CompanyRegionAndSector>
            )}
          </>
        )
      }}
    </FormStateful>
  )
}

AddCompanyForm.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
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
}

export default AddCompanyForm
