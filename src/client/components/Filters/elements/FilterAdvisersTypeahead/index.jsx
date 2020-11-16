import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import { throttle } from 'lodash'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import { Typeahead, FieldWrapper } from '../../../../components'

import Task from '../../../../components/Task'

import { parseAdviserData } from '../../../../../common/formatAdviser'

const getAdviserIds = (advisers) => ({
  adviser: advisers ? advisers.map(({ value }) => value) : [],
})

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
  taskProps,
  label = '',
  hint = '',
  isMulti = false,
  placeholder = '',
  onlyShowActiveAdvisers = true,
  noOptionsMessage = () => null,
  closeMenuOnSelect = false,
  selectedAdvisers = null,
  loadOptions = fetchAdvisers(onlyShowActiveAdvisers),
}) => (
  <StyledFieldWrapper label={label} name={name} hint={hint}>
    <Task.Status {...taskProps}>
      {() => (
        <Route>
          {({ history }) => {
            const qsParams = qs.parse(location.search.slice(1))
            return (
              <Typeahead
                styles={{
                  multiValueRemove: () => ({
                    display: 'none',
                  }),
                  clearIndicator: () => ({
                    display: 'none',
                  }),
                }}
                ClearIndicator={() => null}
                name={name}
                aria-label={name}
                placeholder={placeholder}
                noOptionsMessage={noOptionsMessage}
                closeMenuOnSelect={closeMenuOnSelect}
                loadOptions={loadOptions}
                isMulti={isMulti}
                value={
                  selectedAdvisers &&
                  selectedAdvisers.map(({ advisers }) => ({
                    label: advisers.name,
                    value: advisers.id,
                  }))
                }
                onChange={(adviser) => {
                  history.push({
                    search: qs.stringify({
                      ...qsParams,
                      ...getAdviserIds(adviser),
                      page: 1,
                    }),
                  })
                }}
              />
            )
          }}
        </Route>
      )}
    </Task.Status>
  </StyledFieldWrapper>
)

FilterAdvisersTypeAhead.propTypes = {
  name: PropTypes.string.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default FilterAdvisersTypeAhead
