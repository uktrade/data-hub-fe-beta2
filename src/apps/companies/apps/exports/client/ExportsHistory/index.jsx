import React from 'react'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { CollectionList } from 'data-hub-components'
import { connect } from 'react-redux'

import Task from '../../../../../../client/components/Task/index.jsx'
import { state2props } from './state'
import {
  EXPORTS_HISTORY__LOADED,
  EXPORTS_HISTORY__SELECT_PAGE,
} from '../../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

export default connect(state2props, (dispatch) => ({
  onPageClick: (page, event) => {
    event.target.blur()
    event.preventDefault()
    dispatch({
      type: EXPORTS_HISTORY__SELECT_PAGE,
      page,
    })
  },
}))(
  ({
    count,
    results,
    onPageClick,
    activePage,
    companyId,
    countryId,
    pageTitle,
  }) => {
    return (
      <Wrapper>
        <Task.Status
          name="Exports history"
          id="exportsHistory"
          progressMessage="loading Exports History"
          startOnRender={{
            payload: { companyId, countryId, activePage },
            onSuccessDispatch: EXPORTS_HISTORY__LOADED,
          }}
        >
          {() => (
            <>
              <H2 size={LEVEL_SIZE[3]}>{pageTitle}</H2>
              <CollectionList
                itemName="result"
                items={results}
                totalItems={count}
                onPageClick={onPageClick}
                activePage={activePage}
              />
            </>
          )}
        </Task.Status>
      </Wrapper>
    )
  }
)
