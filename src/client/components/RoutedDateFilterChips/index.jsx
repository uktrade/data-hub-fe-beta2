import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'
import dateFns from 'date-fns'

import { Chip } from '..'

const RoutedOptionFilterChips = ({
  qsParamName,
  selectedOptions,
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
        return selectedOptions.map(({ value, label }) => (
          <Chip
            key={value}
            value={value}
            onClick={(e) => {
              history.push({
                search: qs.stringify(
                  removeFilterChip(
                    qsParams,
                    qsParamName,
                    e.target.getAttribute('data-value')
                  )
                ),
              })
            }}
            {...props}
          >
            {`${label} : ${dateFns.format(value, 'D MMMM YYYY')}`}
          </Chip>
        ))
      }}
    </Route>
  )
}

RoutedOptionFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedOptions: PropTypes.array.isRequired,
}

export default RoutedOptionFilterChips
