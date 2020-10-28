import React from 'react'
import styled from 'styled-components'

import multiInstance from '../../utils/multiinstance'
import { TOGGLE_SECTION__TOGGLE } from '../../actions'
import icon from './assets/search-gov.uk.svg'

const ToggleContainer = styled('div')`
  margin-bottom: 10px;
`

const StyledDiv = styled('div')`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`

const StyledButton = styled('button')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  color: #005ea5;
  padding: 0 0 15px 0;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
  }
  &::before {
    display: table-cell;
    content: '';
    background: url(${icon}) 0 0 no-repeat;
    width: 30px;
    height: 30px;
    transform: ${({ isOpen }) => (isOpen ? `rotate(0deg)` : `rotate(180deg)`)};
  }
  span {
    display: table-cell;
    vertical-align: middle;
  }
`

const ToggleSection = ({ label, open, isOpen = true, children }) => {
  return (
    <ToggleContainer>
      <StyledButton onClick={() => open(!isOpen)} isOpen={isOpen}>
        <span>{label}</span>
      </StyledButton>
      <StyledDiv isOpen={isOpen}>{children}</StyledDiv>
    </ToggleContainer>
  )
}

export default multiInstance({
  name: 'ToggleSection',
  actionPattern: 'TOGGLE_SECTION__',
  dispatchToProps: (dispatch) => ({
    open: (isOpen) =>
      dispatch({
        type: TOGGLE_SECTION__TOGGLE,
        isOpen,
      }),
  }),
  component: ToggleSection,
  reducer: (state = {}, { type, isOpen }) => {
    switch (type) {
      case TOGGLE_SECTION__TOGGLE:
        return {
          ...state,
          isOpen,
        }
      default:
        return state
    }
  },
})
