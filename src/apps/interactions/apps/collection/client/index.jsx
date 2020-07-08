import React from 'react'
import { connect } from 'react-redux'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import urls from '../../../../../lib/urls'
import { Pagination } from 'data-hub-components'

import { Main } from '../../../../../client/components'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import { ID as STATE_ID, TASK_UPDATE_INTERACTIONS, state2props } from './state'
import Filters from './Filters'
import List from './List'

const Interactions = ({ count, onPage }) => {
  return (
    <>
      <LocalHeader
        heading="Interactions"
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
            <Pagination
              totalPages={(Math.ceil(count / 10)) || 0}
              onPageClick={onPage}
            />
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

export default connect(state2props, (dispatch) => ({
  onPage: (query) => {
    console.log('ouch')
   }}))(Interactions)
