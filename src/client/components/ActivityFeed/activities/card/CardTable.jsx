/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import Table from '@govuk-react/table'
import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

import { ReadMore } from '../../../../components'

const GovUkTable = styled(Table)`
  ${MEDIA_QUERIES.TABLET} {
    margin-bottom: ${({ isNotWrappedInDetails }) =>
      isNotWrappedInDetails ? '0' : SPACING.SCALE_2};
  }

  th {
    width: ${({ isNotWrappedInDetails }) =>
      isNotWrappedInDetails ? '284px' : '270px'};
  }

  th,
  td {
    font-weight: normal;
    border: 0;
    padding: ${SPACING.SCALE_2};
    font-size: 16px;
    vertical-align: top;
  }
`

class DetailsRow extends React.PureComponent {
  static propTypes = {
    header: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { header, children } = this.props

    if (!children) {
      return null
    }

    return (
      <Table.Row role="row">
        <Table.CellHeader
          style={{ fontWeight: 'normal', border: 0 }}
          role="cell"
        >
          {header}
        </Table.CellHeader>
        <Table.Cell style={{ border: 0 }} role="cell">
          {children}
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default class CardTable extends React.Component {
  static propTypes = {
    isNotWrappedInDetails: PropTypes.bool,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        header: PropTypes.string,
        content: PropTypes.node,
      })
    ).isRequired,
  }

  static defaultProps = {
    isNotWrappedInDetails: false,
  }

  render() {
    const { rows, isNotWrappedInDetails } = this.props
    return (
      <GovUkTable isNotWrappedInDetails={isNotWrappedInDetails} role="table">
        {rows.map(({ header, content, hasReadmore }) => (
          <DetailsRow header={header} key={header} role="row">
            {hasReadmore ? <ReadMore text={content} /> : content}
          </DetailsRow>
        ))}
      </GovUkTable>
    )
  }
}
