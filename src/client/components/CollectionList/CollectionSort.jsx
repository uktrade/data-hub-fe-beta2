import React from 'react'
import styled from 'styled-components'
import { GREY_1 } from 'govuk-colours'

import CollectionHeaderRow from './CollectionHeaderRow'
import Sort from '../Sort'

const StyledSpan = styled('span')`
  color: ${GREY_1};
`

function CollectionSort({
  children,
  sortInput,
  sortOnChange,
  totalPages,
  activePage,
}) {
  const actions = (
    <Sort
      name="sortBy"
      label="Sort by"
      input={sortInput}
      onChange={(event) => sortOnChange(event.target.value)}
    >
      {children}
    </Sort>
  )

  return (
    <CollectionHeaderRow actions={actions}>
      <StyledSpan>
        Page {activePage} of {totalPages}
      </StyledSpan>
    </CollectionHeaderRow>
  )
}

export default CollectionSort
