import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'

import { Chip } from '..'

const RoutedAdviserFilterChips = ({
  qsParamName,
  selectedAdvisers,
  ...props
}) => {
  const removeFilterChip = (qsParams, queryParam, targetValue = null) =>
    Object.entries(qsParams)
      .map(([key]) => {
        if (key === queryParam) {
          return Array.isArray(qsParams[key])
            ? {
                ...qsParams,
                [key]: qsParams[key].filter((x) => x !== targetValue),
              }
            : omit(qsParams, queryParam)
        }
      })
      .filter(Boolean)[0]

  return (
    <Route>
      {({ location, history }) => {
        const qsParams = qs.parse(location.search.slice(1))
        return selectedAdvisers.map(({ advisers: { name, id } }) => (
          <Chip
            key={id}
            value={id}
            onClick={(e) => {
              history.push({
                search: qs.stringify({
                  ...removeFilterChip(
                    qsParams,
                    qsParamName,
                    e.target.getAttribute('data-value')
                  ),
                }),
              })
            }}
            {...props}
          >
            {name}
          </Chip>
        ))
      }}
    </Route>
  )
}

RoutedAdviserFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedAdvisers: PropTypes.array.isRequired,
}

export default RoutedAdviserFilterChips
