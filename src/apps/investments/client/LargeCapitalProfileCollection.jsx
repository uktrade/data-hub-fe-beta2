import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../client/components/'
import Task from '../../../client/components/Task/index.jsx'
import { TASK_GET_PROFILES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
  INVESTMENTS__PROFILES_SORT_BY_CHANGED,
} from '../../../client/actions'

const LargeCapitalProfileCollection = ({
  page,
  count,
  results,
  sortBy,
  isComplete,
  onPageClick,
  onSortByChange,
}) => {
  return (
    <Task.Status
      name={TASK_GET_PROFILES_LIST}
      id={ID}
      progressMessage="loading profiles..."
      startOnRender={{
        payload: { page, sortBy },
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
            sortOptions={
              <>
                <option value="-created_on">Most recently created</option>
                <option value="created_on">Least recently created</option>
                <option value="-modified_on">Most recently updated</option>
                <option value="modified_on">Least recently updated</option>
                <option value="-investor_company">Company Name A-Z</option>
                <option value="investor_company">Company Name Z-A</option>
              </>
            }
            sortOnChange={onSortByChange}
            sortInput={sortBy}
          />
        )
      }
    </Task.Status>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__PROFILES_SELECT_PAGE,
      page,
    })
  },
  onSortByChange: (sortBy) => {
    dispatch({
      type: INVESTMENTS__PROFILES_SORT_BY_CHANGED,
      sortBy,
    })
  },
}))(LargeCapitalProfileCollection)
