import React from 'react'
import { connect } from 'react-redux'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import urls from '../../../../../lib/urls'
import { Pagination } from 'data-hub-components'

import Task from '../../../../../client/components/Task'
import { Main } from '../../../../../client/components'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import {
  INTERACTIONS__PAGE_CHANGE,
  TASK_UPDATE__INTERACTIONS,
} from '../../../../../client/actions'
import { ID as STATE_ID, state2props } from './state'
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
            <Task>
              {(getTask) => (
                <Pagination
                  totalPages={Math.ceil(count / 10) || 0}
                  onPageClick={(page, event) => {
                    event.preventDefault()
                    onPage(page)
                  }}
                />
              )}
            </Task>
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

export default connect(state2props, (dispatch) => ({
  onPage: (page) => {
    dispatch({
      type: INTERACTIONS__PAGE_CHANGE,
      page,
    })
  },
}))(Interactions)
