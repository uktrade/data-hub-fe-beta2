import React from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import urls from '../../../../../lib/urls'

import { Main } from '../../../../../client/components'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Filters from './Filters'
import List from './List'

const Interactions = ({}) => {
  return (
    <>
      <LocalHeader
        heading='Interactions'
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          {
            text: 'Interactions',
          },
        ]}
      />
      <Main>
        <GridRow>
          <GridCol setWidth="one-third">
            <Filters />
          </GridCol>
          <GridCol setWidth="two-thirds">
            <List />
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

export default Interactions
