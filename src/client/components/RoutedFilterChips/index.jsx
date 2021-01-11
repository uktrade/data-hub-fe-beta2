import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'

import Chip from '../Chip'

/**
 * Removes the targetParam with targetValue from qsParams
 *
 * When the targetParam corresponds to an array of values it removes the item
 * with targetValue, otherwise it removes that param entirely.
 */
const removeParamFromQs = (qsParams, targetParam, targetValue = null) => {
  return Object.entries(qsParams)
    .map(([key]) => {
      if (key === targetParam) {
        return Array.isArray(qsParams[key])
          ? {
              ...qsParams,
              [key]: qsParams[key].filter((x) => x !== targetValue),
            }
          : omit(qsParams, targetParam)
      }
    })
    .filter(Boolean)[0]
}

const RoutedFilterChips = ({
  qsParamName,
  selectedOptions,
  showCategoryLabels = false,
  ...props
}) => (
  <Route>
    {({ location, history }) => {
      const clearFilter = (value) => {
        const qsParams = qs.parse(location.search.slice(1))
        const newQsParams = removeParamFromQs(qsParams, qsParamName, value)
        history.push({ search: qs.stringify(newQsParams) })
      }
      return selectedOptions.map(({ value, label, categoryLabel }) => (
        <Chip
          key={value}
          value={value}
          onClick={() => clearFilter(value)}
          {...props}
        >
          {showCategoryLabels ? `${categoryLabel}: ${label}` : label}
        </Chip>
      ))
    }}
  </Route>
)

RoutedFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedOptions: PropTypes.array.isRequired,
}

export default RoutedFilterChips
