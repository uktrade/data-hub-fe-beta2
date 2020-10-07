import React from 'react'
import dateFns from 'date-fns'
import styled from 'styled-components'

import { Tag } from '../../../client/components'

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

const Panel = styled('div')`
  margin: 10px 0 10px;
`

const PanelTitle = styled('a')`
  font-weight: bold;
  font-size: 16px;
`
const PanelDetail = styled('div')`
  font-size: 14px;
  margin: 10px 0;
`
const TagDetail = styled('div')`
  font-size: 12px;
  margin: 5px 0;
`

const QuotesWidget = ({ quotes }) => (
  <Widget>
    <StyledHeader>My Quotes</StyledHeader>
    {quotes.map((d, i) => (
      <Panel>
        <PanelTitle href={`omis/${d.id}/work-order`} key={i}>
          {d.reference}
        </PanelTitle>
        <PanelDetail>Company: {d.company_name}</PanelDetail>
        <PanelDetail>
          Quote Expires: {dateFns.format(d.quote.expires_on, 'D MMM YYYY')}
        </PanelDetail>
        <Tag
          colour={
            new Date(d.quote.expires_on) < dateFns.addWeeks(new Date(), 1)
              ? 'red'
              : 'green'
          }
        >
          <TagDetail>
            {dateFns.distanceInWordsToNow(d.quote.expires_on)}
          </TagDetail>
        </Tag>
      </Panel>
    ))}
  </Widget>
)

export default QuotesWidget
