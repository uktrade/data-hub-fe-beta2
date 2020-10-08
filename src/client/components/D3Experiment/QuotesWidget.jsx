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

const isExpired = (quote) => new Date(quote.expires_on) < new Date()

const tagColour = (quote) => {
  const d = new Date(quote.expires_on)
  if (d < new Date()) {
    return 'red'
  } else if (d < dateFns.addWeeks(new Date(), 1)) {
    return 'yellow'
  } else {
    return 'green'
  }
}

const QuotesWidget = ({ quotes }) => (
  <Widget>
    <StyledHeader>My Quotes</StyledHeader>
    {quotes
      .sort(
        (a, b) => new Date(a.quote.expires_on) - new Date(b.quote.expires_on)
      )
      .map((d, i) => (
        <Panel>
          <PanelTitle href={`omis/${d.id}/work-order`} key={i}>
            {d.reference}
          </PanelTitle>
          <PanelDetail>Company: {d.company_name}</PanelDetail>
          <PanelDetail>
            {isExpired(d.quote)
              ? `Quote Expired: ${dateFns.format(
                  d.quote.expires_on,
                  'D MMM YYYY'
                )}`
              : `Quote Expires: ${dateFns.format(
                  d.quote.expires_on,
                  'D MMM YYYY'
                )}`}
          </PanelDetail>
          <Tag colour={tagColour(d.quote)}>
            <TagDetail>
              {isExpired(d.quote) ? 'expired ' : ''}
              {dateFns.distanceInWordsToNow(d.quote.expires_on)}
              {isExpired(d.quote) ? ' ago' : ''}
            </TagDetail>
          </Tag>
        </Panel>
      ))}
  </Widget>
)

export default QuotesWidget
