import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLUE, GREY_3, RED } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import icon from './assets/caret.svg'

const ToggleContainer = styled('div')`
  ${({ major }) => `
    margin-bottom: ${SPACING.SCALE_2};
    border: solid 2px ${GREY_3};
    border-top-color: ${major ? RED : BLUE};
  `}
`

const StyledHeader = styled('div')`
  display: flex;
  align-items: center;
  background-color: ${GREY_3};
`

const StyledContent = styled('div')`
  ${({ isOpen }) => `
    display: ${isOpen ? 'block' : 'none'};
    padding: 0 ${SPACING.SCALE_3};
    margin: ${SPACING.SCALE_3} 0;
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
    font-weight: ${FONT_WEIGHTS.regular};
    padding: 13px 0;

    &::before {
      content: '';
      background: url(${icon}) 7px 0 no-repeat;
      width: 44px;
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
  text-decoration: underline;
`

const BadgeContainer = styled('span')`
  margin-left: ${SPACING.SCALE_1};
`

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  float: right;
  margin: 5px;
  color: red;
`

const renderRequiredFields = (requiredFieldFlag, fieldCount) => {
  if (requiredFieldFlag) {
    return <StyledLabel>{fieldCount} fields required</StyledLabel>
  }
}

const PrimaryToggleSection = ({
  label,
  badge = null,
  open,
  isOpen = false,
  children,
  showRequiredField = false,
  fieldCount = 0,
  ...props
}) => (
  <ToggleContainer {...props}>
    <StyledHeader>
      <StyledButton
        data-test="toggle-section-button"
        onClick={() => open(!isOpen)}
        isOpen={isOpen}
      >
        <ButtonContent data-test="toggle-section-button-content">
          {label}
        </ButtonContent>
      </StyledButton>
      {renderRequiredFields(showRequiredField, fieldCount)}
      {badge && <BadgeContainer>{badge}</BadgeContainer>}
    </StyledHeader>
    <StyledContent isOpen={isOpen}>{children}</StyledContent>
  </ToggleContainer>
)

PrimaryToggleSection.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
}

export default PrimaryToggleSection
