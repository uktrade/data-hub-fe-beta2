import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../client/components/'
import { TASK_GET_OPPORTUNITIES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../client/actions'

const LargeCapitalOpportunityCollection = ({
  page,
  count,
  results,
  onPageClick,
  isComplete,
}) => {
  const collectionListTask = {
    name: TASK_GET_OPPORTUNITIES_LIST,
    id: ID,
    progressMessage: 'loading opportunities...',
    startOnRender: {
      payload: { page },
      onSuccessDispatch: INVESTMENTS__OPPORTUNITIES_LOADED,
    },
  }

  return (
    <CollectionList
      taskProps={collectionListTask}
      collectionName="Opportunity"
      items={results}
      count={count}
      onPageClick={onPageClick}
      activePage={page}
      isComplete={isComplete}
      baseDownloadLink="/investments/opportunities/export"
      entityName="opportunitie"
      addItemUrl="/investments/opportunities/create"
    />
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalOpportunityCollection)
