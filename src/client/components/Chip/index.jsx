import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { GREY_3 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

const StyledSpan = styled('span')`
  display: inline-block;
  padding: 12px;
  margin: 4px;
  background-color: ${GREY_3};
  border-radius: ${SPACING.SCALE_2};
`

const Chip = ({ label }) => <StyledSpan>{label}</StyledSpan>

Chip.propTypes = {
  label: PropTypes.string.isRequired,
}

export default Chip
