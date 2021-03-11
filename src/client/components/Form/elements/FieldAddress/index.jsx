import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import { Search } from '@govuk-react/icons'
import Select from '@govuk-react/select'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import FormGroup from '@govuk-react/form-group'
import styled from 'styled-components'

import { useFormContext } from '../../hooks'
import useAddressSearch from '../../../AddressSearch/useAddressSearch'
import usePostcodeLookup from '../../../AddressSearch/usePostcodeLookup'
import FieldInput from '../FieldInput'
import FieldUneditable from '../FieldUneditable'
import FieldWrapper from '../FieldWrapper'
import StatusMessage from '../../../StatusMessage'
import axios from 'axios'
import { transformObjectToOption } from '../../../../../apps/transformers'
import FieldSelect from '../FieldSelect'

const UNITED_KINGDOM = 'United Kingdom'
const UNITED_STATES = 'United States'
const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA = 'Canada'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

const StyledFieldPostcode = styled(FieldInput)`
  ${MEDIA_QUERIES.TABLET} {
    max-width: 200px;
  }
`

const FieldAddress = ({
  name,
  label,
  legend,
  hint,
  country,
  apiEndpoint,
  onSelectUKAddress,
}) => {
  const findAddress = usePostcodeLookup(apiEndpoint)
  const { onAddressSearch, isSubmitting, error, addressList } =
    useAddressSearch(findAddress)
  const {
    values: { postcode },
    setFieldValue,
    validateForm,
    setIsLoading,
  } = useFormContext()

  const [usStates, setUsStates] = useState([])
  const [canadaProvinces, setCanadaProvinces] = useState([])
  useEffect(() => setIsLoading(isSubmitting), [isSubmitting])
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api-proxy/v4/metadata/administrative-area')

      setUsStates(
        result.data
          .filter(
            (administrativeAreas) =>
              administrativeAreas.country.id === UNITED_STATES_ID
          )
          .map((states) => transformObjectToOption(states))
      )

      setCanadaProvinces(
        result.data
          .filter(
            (administrativeAreas) =>
              administrativeAreas.country.id === CANADA_ID
          )
          .map((states) => transformObjectToOption(states))
      )
    }

    fetchData()
  }, [])

  const isUK = country.name === UNITED_KINGDOM
  const isUS = country.name === UNITED_STATES
  const isCanada = country.name === CANADA

  function onSearchClick(e) {
    e.preventDefault()

    return isEmpty(validateForm(['postcode']))
      ? onAddressSearch(postcode)
      : null
  }

  const onAddressSelect = (evt) => {
    const index = evt.target.selectedIndex
    if (index === 0) {
      return
    }

    const address = addressList[index]
    setFieldValue('postcode', address.postcode)
    setFieldValue('address1', address.address1)
    setFieldValue('address2', address.address2)
    setFieldValue('city', address.city)
    setFieldValue('county', address.county)
    setFieldValue('country', country.id)
    setFieldValue('area', address.area)
    setFieldValue('country', country.id)

    if (onSelectUKAddress) {
      onSelectUKAddress(address)
    }
  }

  const renderUsStateField = () => {
    if (isUS && usStates.length > 0) {
      return (
        <FieldSelect type="text" name="area" label="State" options={usStates} />
      )
    }
  }

  const renderCanadaProvinceField = () => {
    if (isCanada && canadaProvinces?.length > 0) {
      return (
        <FieldSelect
          type="text"
          name="area"
          label="Province"
          options={canadaProvinces}
        />
      )
    }
  }

  return (
    <FieldWrapper {...{ name, label, legend, hint }} showBorder={true}>
      {isUK && (
        <>
          <StyledFieldPostcode
            type="search"
            name="postcode"
            label="Postcode"
            required="Enter postcode"
            maxLength={10}
          />

          <Button
            onClick={onSearchClick}
            buttonColour={GREY_3}
            buttonTextColour={BLACK}
            icon={<Search />}
          >
            Find UK address
          </Button>

          {error && (
            <StatusMessage>
              Error occurred while searching for an address. Enter the address
              manually.
            </StatusMessage>
          )}

          {addressList && addressList.length > 0 && (
            <FormGroup>
              <Select label="Select an address" onChange={onAddressSelect}>
                {addressList.map(({ address1 }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={index} value={index}>
                    {address1}
                  </option>
                ))}
              </Select>
            </FormGroup>
          )}
        </>
      )}

      {!isUK && (
        <StyledFieldPostcode
          type="text"
          name="postcode"
          label="Postcode (optional)"
        />
      )}

      <FieldInput
        type="text"
        name="address1"
        label="Address line 1"
        required="Enter address line 1"
      />
      <FieldInput
        type="text"
        name="address2"
        label="Address line 2 (optional)"
      />
      <FieldInput
        type="text"
        name="city"
        label="Town or city"
        required="Enter town or city"
      />
      {renderUsStateField()}
      {renderCanadaProvinceField()}
      <FieldInput type="text" name="county" label="County (optional)" />
      <FieldUneditable name="country" label="Country">
        {country.name}
      </FieldUneditable>
    </FieldWrapper>
  )
}

FieldAddress.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  country: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  onSelectUKAddress: PropTypes.func,
}

FieldAddress.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  onSelectUKAddress: null,
}

export default FieldAddress
