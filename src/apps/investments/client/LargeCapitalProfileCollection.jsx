import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../client/components/'
import { TaskStatus } from '../../../client/components/Task/index'
import { TASK_GET_PROFILES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
} from '../../../client/actions'

const LargeCapitalProfileCollection = ({
  page,
  count,
  results,
  onPageClick,
  isComplete,
}) => {
  return (
    <TaskStatus
      name={TASK_GET_PROFILES_LIST}
      id={ID}
      progressMessage="loading profiles..."
      startOnRender={{
        payload: { page },
        onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
      }}
    >
      {() =>
        isComplete && (
          <CollectionList
            itemName="profile"
            items={results}
            totalItems={count}
            onPageClick={onPageClick}
            activePage={page}
          />
        )
      }
    </TaskStatus>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__PROFILES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalProfileCollection)
