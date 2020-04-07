import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { SummaryTable } from 'data-hub-components'

const StyledSummaryTable = styled(SummaryTable)`
  caption {
    font-size: ${FONT_SIZE.SIZE_16};
  }

  & > tbody > tr:first-child {
    border-top: none;
  }

  & > tbody > tr > th {
    border: none;
    font-weight: normal;
  }

  & > tbody > tr > td {
    border: none;
    font-weight: bold;
  }
`

function EditHistoryChangeList({ changes }) {
  return (
    <>
      {
        <StyledSummaryTable caption="Job title">
          <SummaryTable.Row heading="Information before change">
            {changes.job_title[0]}
          </SummaryTable.Row>
          <SummaryTable.Row heading="Information after change">
            {changes.job_title[1]}
          </SummaryTable.Row>
        </StyledSummaryTable>
      }
    </>
  )
}

EditHistoryChangeList.propTypes = {
  changes: PropTypes.array.isRequired,
}

export default EditHistoryChangeList
