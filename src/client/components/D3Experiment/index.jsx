import React, { useState } from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import styled from 'styled-components'
import dateFns from 'date-fns'

import { Tag } from '../../../client/components'

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'

const StyledHeader = styled('h2')`
  background-color: #f8f8f8;
  padding: 10px;
  margin: 5px 0 5px;
`

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

const getQuotes = (data) => {
  let quotes = []
  Object.values(data).forEach((orders) => {
    for (const item of orders.items) {
      item.quote && quotes.push(item)
    }
  })
  return quotes
}

const Quotes = ({ quotes }) => (
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

// based on: https://codesandbox.io/s/r5wp0v08xq?file=/src/PieSVG.js
const Arc = ({ data, index, createArc, colors, format, onSelectSegment }) =>
  data.value > 0 && (
    <g key={index} className="arc" onClick={() => onSelectSegment(data.index)}>
      <path className="arc" d={createArc(data)} fill={colors(index)} />
      <text
        transform={`translate(${createArc.centroid(data)})`}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        fontSize="10"
      >
        {format(data.value)}
      </text>
    </g>
  )

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
            <PanelTitle href={`omis/${d.id}/work-order`} key={i}>
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

const Pie = ({
  innerRadius,
  outerRadius,
  width,
  height,
  dataset,
  onSelectSegment,
}) => {
  const createPie = d3
    .pie()
    .value((data) => data[1].count)
    .sort(null)
  const createArc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
  const colors = d3.scaleOrdinal(d3.schemeCategory10)
  const format = d3.format('')
  const data = createPie(dataset)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${outerRadius} ${outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
            format={format}
            onSelectSegment={onSelectSegment}
          />
        ))}
      </g>
    </svg>
  )
}

const D3Experiment = () => {
  const [dataset, setDataset] = useState([])
  const [selectedArc, setSelectedArc] = useState()
  const [quotes, setQuotes] = useState([])

  React.useEffect(() => {
    axios.get('/api-proxy/v3/omis/order/status').then(({ data }) => {
      setDataset(Object.entries(data).filter((d) => d[1].percent > 0))
      setQuotes(getQuotes(data))
    })
  }, [])

  const onSelectSegment = (index) =>
    selectedArc == index ? setSelectedArc(null) : setSelectedArc(index)

  return (
    <>
      {quotes && <Quotes quotes={quotes} />}
      <Widget>
        <StyledHeader>My Orders</StyledHeader>
        <svg viewBox="0 0 150 150">
          <Pie
            innerRadius="30"
            outerRadius="70"
            width="300"
            height="150"
            dataset={dataset}
            onSelectSegment={onSelectSegment}
          />
        </svg>
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
      </Widget>
    </>
  )
}

export default D3Experiment
