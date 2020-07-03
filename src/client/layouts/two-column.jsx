import React from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { Main } from '../components'

const TwoColumn = ({}) => {
  return (
    <Main>
      <GridRow>
        <GridCol setWidth="one-third"></GridCol>
        <GridCol setWidth="two-thirds"></GridCol>
      </GridRow>
    </Main>
  )
}


export default TwoColumn
