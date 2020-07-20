import React from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import { Search } from '@govuk-react/icons'
import Select from '@govuk-react/select'
import Button from '@govuk-react/button'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import FormGroup from '@govuk-react/form-group'
import styled from 'styled-components'

import {
  useFormContext,
  useAddressSearch,
  usePostcodeLookup,
  FieldInput,
  FieldUneditable,
  StatusMessage,
} from 'data-hub-components'
import FieldWrapper from 'data-hub-components/dist/forms/elements/FieldWrapper'

const UNITED_KINGDOM = 'United Kingdom'

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
  const { onAddressSearch, error, addressList } = useAddressSearch(findAddress)
  const {
    values: { postcode },
    setFieldValue,
  } = useFormContext()

  const isUK = country.name === UNITED_KINGDOM

  function onSearchClick(e) {
    e.preventDefault()
    onAddressSearch(postcode)
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

    if (onSelectUKAddress) {
      onSelectUKAddress(address)
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
