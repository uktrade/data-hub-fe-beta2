import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../../client/components'
import { TASK_GET_OPPORTUNITIES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../../client/actions'

const LargeCapitalOpportunityCollection = ({
  count,
  results,
  payload,
  onPageClick,
  activePage,
  isComplete,
  optionMetadata,
}) => (
  <CollectionList
    taskProps={{
      name: TASK_GET_OPPORTUNITIES_LIST,
      id: ID,
      progressMessage: 'Loading opportunities',
      startOnRender: {
        payload: { payload, activePage },
        onSuccessDispatch: INVESTMENTS__OPPORTUNITIES_LOADED,
      },
    }}
    collectionName="opportunity"
    items={results}
    count={count}
    onPageClick={onPageClick}
    activePage={activePage}
    isComplete={isComplete}
    entityName="opportunity"
    entityNamePlural="opportunities"
    addItemUrl="/investments/opportunities/create"
    baseDownloadLink="/investments/opportunities/export"
    sortOptions={optionMetadata.sortOptions}
  />
)

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalOpportunityCollection)
