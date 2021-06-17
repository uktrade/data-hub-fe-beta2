import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import qs from 'qs'

import styled from 'styled-components'
import { GREY_1 } from 'govuk-colours'

import CollectionHeaderRow from './CollectionHeaderRow'
import RoutedSelect from '../RoutedSelect'

const StyledSpan = styled('span')`
  color: ${GREY_1};
`

const CollectionSort = ({ sortOptions, totalPages }) => {
  const actions = (
    <RoutedSelect
      data-test="sortby"
      name="sortBy"
      qsParamName="sortby"
      label="Sort by"
    >
      {sortOptions.map(({ name, value }, i) => {
        return (
          <option value={value} key={i}>
            {name}
          </option>
        )
      })}
    </RoutedSelect>
  )

  return (
    <CollectionHeaderRow actions={actions}>
      <Route>
        {({ location: { search } }) => {
          const searchParams = qs.parse(search.slice(1))
          return (
            <StyledSpan>
              Page {searchParams.page || 1} of {totalPages}
            </StyledSpan>
          )
        }}
      </Route>
    </CollectionHeaderRow>
  )
}

CollectionSort.propTypes = {
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalPages: PropTypes.number.isRequired,
}

export default CollectionSort
