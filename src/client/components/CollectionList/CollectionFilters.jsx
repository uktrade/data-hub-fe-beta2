import React from 'react'
import GridCol from '@govuk-react/grid-col'
import Task from '../Task'

const CollectionFilters = ({ children, taskProps }) => {
  return (
    <GridCol setWidth="one-third">
      <Task.Status {...taskProps}>
        {() => (
          <nav aria-label="Filters" data-test="company-information-filters">
            {children}
          </nav>
        )}
      </Task.Status>
    </GridCol>
  )
}

export default CollectionFilters
