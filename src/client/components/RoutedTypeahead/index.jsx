import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { FONT_WEIGHTS } from '@govuk-react/constants'

import FieldWrapper from '../Form/elements/FieldWrapper/'
import Typeahead from '../Typeahead'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

const getParamIds = (qsParam, pickedOptions) => ({
  [qsParam]: pickedOptions ? pickedOptions.map(({ value }) => value) : [],
})

const RoutedTypeahead = ({
  name,
  qsParam,
  label = '',
  hint = '',
  isMulti = false,
  placeholder = '',
  closeMenuOnSelect = false,
  selectedOptions = null,
  loadOptions = null,
  noOptionsMessage = () => null,
  options = null,
  ...props
}) => (
  <Route>
    {({ history, location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      return (
        <StyledFieldWrapper label={label} name={name} hint={hint} {...props}>
          <Typeahead
            styles={{
              multiValueRemove: () => ({
                display: 'none',
              }),
              clearIndicator: () => ({
                display: 'none',
              }),
            }}
            name={name}
            aria-label={name}
            placeholder={placeholder}
            options={options}
            closeMenuOnSelect={closeMenuOnSelect}
            isMulti={isMulti}
            value={selectedOptions}
            loadOptions={loadOptions}
            noOptionsMessage={noOptionsMessage}
            onChange={(pickedOptions) => {
              history.push({
                search: qs.stringify({
                  ...qsParams,
                  ...getParamIds(qsParam, pickedOptions),
                  page: 1,
                }),
              })
            }}
          />
        </StyledFieldWrapper>
      )
    }}
  </Route>
)

RoutedTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  qsParam: PropTypes.string.isRequired,
}

export default RoutedTypeahead
