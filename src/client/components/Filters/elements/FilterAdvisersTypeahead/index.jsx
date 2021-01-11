import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'
import styled from 'styled-components'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import { Typeahead, FieldWrapper } from '../../../../components'
import { TaskStatus } from '../../../../components/Task'

import { parseAdviserData } from '../../../../../common/formatAdviser'

const fetchAdvisers = (onlyShowActiveAdvisers) =>
  throttle(
    (searchString) =>
      axios
        .get('/api-proxy/adviser/', {
          params: {
            autocomplete: searchString,
            is_active: onlyShowActiveAdvisers,
          },
        })
        .then(({ data: { results } }) => parseAdviserData(results)),
    500
  )

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

const FilterAdvisersTypeAhead = ({
  name,
  label = '',
  taskProps,
  hint = '',
  required = false,
  isMulti = false,
  placeholder = '',
  onlyShowActiveAdvisers = true,
  noOptionsMessage = () => null,
  closeMenuOnSelect = false,
  onChange,
  selectedAdvisers = null,
  loadOptions = fetchAdvisers(onlyShowActiveAdvisers),
}) => {
  return (
    <StyledFieldWrapper label={label} name={name} hint={hint}>
      <TaskStatus {...taskProps}>
        {() => (
          <Typeahead
            name={name}
            aria-label={name}
            placeholder={placeholder}
            noOptionsMessage={noOptionsMessage}
            closeMenuOnSelect={closeMenuOnSelect}
            required={required}
            loadOptions={loadOptions}
            isMulti={isMulti}
            onChange={onChange}
            value={selectedAdvisers}
          />
        )}
      </TaskStatus>
    </StyledFieldWrapper>
  )
}

FilterAdvisersTypeAhead.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default FilterAdvisersTypeAhead
