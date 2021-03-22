import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLACK, BLUE, YELLOW } from 'govuk-colours'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import icon from './assets/caret.svg'

const ToggleContainer = styled('div')`
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledHeader = styled('div')`
  display: flex;
  align-items: center;
`

const StyledContent = styled('div')`
  ${({ isOpen }) => `
    display: ${isOpen ? 'block' : 'none'};
    padding: 0;
  `}
`

const StyledButton = styled('button')`
  ${({ isOpen }) => `
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    font-size: ${FONT_SIZE.SIZE_19};
    color: ${BLUE};
    cursor: pointer;
    padding: 0 0 ${SPACING.SCALE_3}; 0;

    &::before {
      content: '';
      background: url(${icon}) 0 0 no-repeat;
      width: 30px;
      height: 30px;
      transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
    }
    &:hover {
      text-decoration: underline;
    }
    &:focus {
      outline: none;
      text-decoration: none;
    }
  `}
`

const ButtonContent = styled('span')`
  ${StyledButton}:focus & {
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
  }
`

const SecondaryToggleSection = ({
  label,
  open,
  isOpen = false,
  children,
  ...props
}) => (
  <ToggleContainer {...props}>
    <StyledHeader>
      <StyledButton
        data-test="toggle-section-button"
        onClick={() => open(!isOpen)}
        isOpen={isOpen}
        {...props}
      >
        <ButtonContent data-test="toggle-section-button-content">
          {label}
        </ButtonContent>
      </StyledButton>
    </StyledHeader>
    <StyledContent isOpen={isOpen}>{children}</StyledContent>
  </ToggleContainer>
)

SecondaryToggleSection.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
}

export default SecondaryToggleSection
