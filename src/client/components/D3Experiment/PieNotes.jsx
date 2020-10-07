import React from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'
import dateFns from 'date-fns'

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'

const StyledAccordionItem = styled(AccordionItem)`
  padding: 1px;
  transition: all 1s ease-out;
`

const StyledAccordionItemPanel = styled(AccordionItemPanel)`
  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: fadein 0.35s ease-in;

  padding: 10px;
  margin-bottom: 10px;

  &:nth-child(2) {
    margin-top: 10px;
  }

  &:last-child {
    margin-bottom: 10px;
  }
`

const PanelTitle = styled('a')`
  font-weight: bold;
  font-size: 16px;
`
const PanelDetail = styled('div')`
  font-size: 14px;
  margin: 10px 0;
`

const Key = ({ data, colour, selectedArc, onSelectSegment, index }) =>
  data.count > 0 && (
    <StyledAccordionItem dangerouslySetExpanded={selectedArc}>
      <AccordionItemHeading
        style={{
          background: colour,
          border: 'none',
          color: 'white',
          padding: '5px',
        }}
        onClick={() => {
          onSelectSegment(index)
        }}
      >
        <AccordionItemButton>
          {data.label}: {data.count}
        </AccordionItemButton>
      </AccordionItemHeading>
      <StyledAccordionItemPanel>
        {data.items.map((d, i) => (
          <>
            <PanelTitle
              href={`omis/${d.id}/work-order`}
              key={`order-notes-${i}`}
            >
              {d.reference}
            </PanelTitle>
            <PanelDetail>Company: {d.company_name}</PanelDetail>
            {d.quote && (
              <PanelDetail>
                Quote Expires:{' '}
                {dateFns.format(d.quote.expires_on, 'D MMM YYYY')}
              </PanelDetail>
            )}
          </>
        ))}
      </StyledAccordionItemPanel>
    </StyledAccordionItem>
  )

const PieNotes = ({ dataset, selectedArc, onSelectSegment }) => (
  <Accordion allowZeroExpanded="true">
    {dataset.map(
      (d, i) =>
        d[1] && (
          <Key
            data={d[1]}
            key={`pie-button-${i}`}
            colour={d3.schemeCategory10[i]}
            selectedArc={selectedArc == i}
            onSelectSegment={onSelectSegment}
            index={i}
          />
        )
    )}
  </Accordion>
)

export default PieNotes
