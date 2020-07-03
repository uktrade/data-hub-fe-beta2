import React from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { Main } from '../../../../../client/components'
import Filters from './Filters'
import List from './List'

const Interactions = ({}) => {
  return (
    <Main>cvcvcncv
      <GridRow>
        <GridCol setWidth="one-third">dfhdgh
          <Filters />
        </GridCol>
        <GridCol setWidth="two-thirds">
          <List />
        </GridCol>
      </GridRow>
    </Main>
  )
}

export default Interactions
