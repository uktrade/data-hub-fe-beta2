import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import { GREY_2 } from 'govuk-colours'

const CardContainer = styled('div')`
  border: ${({ isUpcoming }) =>
    isUpcoming ? `1px dashed ${GREY_2}` : `1px solid ${GREY_2}`};
  padding: ${SPACING.SCALE_3};
`

export default class Card extends React.PureComponent {
  static propTypes = {
    isUpcoming: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    isUpcoming: false,
    children: null,
  }

  render() {
    const { isUpcoming, children } = this.props

    return <CardContainer isUpcoming={isUpcoming}>{children}</CardContainer>
  }
}
