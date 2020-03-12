import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { CollectionList } from 'data-hub-components'

import { connect } from 'react-redux'
import Task from '../../../../../../../client/components/Task/index.jsx'
import { state2props, NOT_IMPLEMENTED } from './state'
import {
  EXPORT_WINS__LOADED,
  EXPORT_WINS__SELECT_PAGE,
} from '../../../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

export default connect(state2props, (dispatch) => ({
  onPageClick: (page, event) => {
    event.target.blur()
    event.preventDefault()
    dispatch({
      type: EXPORT_WINS__SELECT_PAGE,
      page,
    })
  },
}))((state) => {
  if (state[NOT_IMPLEMENTED]) {
    return null
  }

  const { count, results, onPageClick, activePage, companyId } = state

  return (
    <Wrapper>
      <Task.Status
        name="Export wins"
        id="exportWins"
        progressMessage="Loading Exports Wins..."
        startOnRender={{
          payload: { companyId, activePage },
          onSuccessDispatch: EXPORT_WINS__LOADED,
        }}
      >
        {() => (
          <CollectionList
            itemName="result"
            items={results}
            totalItems={count}
            onPageClick={onPageClick}
            activePage={activePage}
          />
        )}
      </Task.Status>
    </Wrapper>
  )
})
