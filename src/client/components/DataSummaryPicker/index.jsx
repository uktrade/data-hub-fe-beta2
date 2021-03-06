import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { state2props } from './state'
import {
  DATA_SUMMARY_PICKER__RANGE_SELECTED,
  DATA_SUMMARY_PICKER__ACCESSIBLE_TOGGLE,
} from '../../actions'

import styled from 'styled-components'
import { get } from 'lodash'
import { BODY_SIZES, SPACING } from '@govuk-react/constants'

import Select from '../../../client/components/Select'
import DataSummary from './DataSummary'

const StyledSelect = styled(Select)`
  display: block;
  margin-bottom: 0;
  font-size: ${BODY_SIZES.XSMALL}px;
  span {
    font-size: ${BODY_SIZES.MEDIUM}px;
    padding-bottom: 7px;
  }
  select {
    width: 100%;
    margin-bottom: ${SPACING.SCALE_3};
    font-size: ${BODY_SIZES.MEDIUM}px;
  }
`

const DataSummaryPicker = ({
  dataRanges,
  selectedRangeName,
  onSelectDataRange = () => {},
  ...props
}) => {
  const [selectedDataRange] = dataRanges.filter(
    ({ name }) => name === (selectedRangeName || dataRanges[0]?.name)
  )
  const data = get(selectedDataRange, 'range', [])

  // This will be either 'Current', 'Previous' or 'Upcoming'
  const yearText = get(selectedDataRange, 'label', '')?.split(' ')[0]

  return (
    <DataSummary data={data} yearText={yearText} {...props}>
      <StyledSelect
        name="sortBy"
        label="Date range"
        input={{
          onChange: (e) => onSelectDataRange(e.target.value),
        }}
        data-test="data-summary-select"
      >
        {dataRanges.map(({ label, name }) => (
          <option value={name} key={name} data-test="data-summary-option">
            {label}
          </option>
        ))}
      </StyledSelect>
    </DataSummary>
  )
}

DataSummaryPicker.propTypes = {
  title: PropTypes.string,
  subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  dataRanges: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      range: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
          link: PropTypes.string,
        })
      ).isRequired,
    })
  ),
  selectedRangeName: PropTypes.string,
  accessible: PropTypes.bool,
  onToggleAccessible: PropTypes.func,
  onSelectDataRange: PropTypes.func,
}

export default connect(state2props, (dispatch) => ({
  onSelectDataRange: (dataRangeName) => {
    dispatch({
      type: DATA_SUMMARY_PICKER__RANGE_SELECTED,
      result: dataRangeName,
    })
  },
  onToggleAccessible: () => {
    dispatch({
      type: DATA_SUMMARY_PICKER__ACCESSIBLE_TOGGLE,
    })
  },
}))(DataSummaryPicker)
