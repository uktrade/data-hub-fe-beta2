import React from 'react'
import styled from 'styled-components'

import PieChart from './PieChart'
import PieNotes from './PieNotes'

const StyledHeader = styled('h2')`
  background-color: #f8f8f8;
  padding: 10px;
  margin: 5px 0 5px;
`
const Widget = styled('div')`
  margin: 0 0 20px;
  padding: 0 0 10px;
  border-bottom: 1px solid #bfc1c3;
`

const OrdersWidget = ({ dataset, onSelectSegment, selectedArc }) => (
  <Widget>
    <StyledHeader>My Orders</StyledHeader>
    <svg viewBox="0 0 150 150">
      <PieChart
        innerRadius="30"
        outerRadius="70"
        width="300"
        height="150"
        dataset={dataset}
        onSelectSegment={onSelectSegment}
      />
    </svg>
    <PieNotes
      dataset={dataset}
      selectedArc={selectedArc}
      onSelectSegment={onSelectSegment}
    />
  </Widget>
)

export default OrdersWidget
