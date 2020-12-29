import React from 'react'
import { GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

const CollectionFilters = ({ children, taskProps }) => {
  return (
    <GridCol setWidth="one-third">
      <Task.Status {...taskProps}>
        {() => <aside>{children}</aside>}
      </Task.Status>
    </GridCol>
  )
}

export default CollectionFilters
