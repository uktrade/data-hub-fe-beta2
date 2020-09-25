import { map } from 'lodash'
import Select from '@govuk-react/select'
import React from 'react'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { GREY_4 } from 'govuk-colours'
import PropTypes from 'prop-types'

const StyledDropdownContainer = styled('div')`
  background: ${GREY_4};
  padding: ${SPACING.SCALE_1}
  display: block;
  
  ${MEDIA_QUERIES.DESKTOP} {
    display: inline-flex;
  }
  
  label {
    display: block;
    
    ${MEDIA_QUERIES.DESKTOP} {
      display: inline-block;
    }
    
    span {
      display: inline-block;
      margin: 0 ${SPACING.SCALE_2}
      width: auto;
      margin: 0;
      
      ${MEDIA_QUERIES.DESKTOP} {
        margin: 0 10px;
      }
    }
    
    select {
      width: 100%;
      
      ${MEDIA_QUERIES.DESKTOP} {
        width: auto;
      }
    }
  } 
`

const SelectFilter = ({ filters, onActivityTypeFilterChange, value }) => {
  return (
    <StyledDropdownContainer>
      <Select
        input={{ defaultValue: value }}
        name="activity-types-filter"
        label="Activity types"
        onChange={onActivityTypeFilterChange}
      >
        {map(filters, (item, index) => {
          return (
            <option key={`selectFilterKey_${index}`} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </Select>
    </StyledDropdownContainer>
  )
}

SelectFilter.propTypes = {
  filters: PropTypes.array.isRequired,
  onActivityTypeFilterChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default SelectFilter
