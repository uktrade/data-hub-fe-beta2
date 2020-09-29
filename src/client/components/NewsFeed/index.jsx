import React from 'react'
import styled from 'styled-components'
import { GREEN } from 'govuk-colours'

import NewsCard from './NewsCard'
import NewsHeader from './NewsHeader'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'

const StyledAccordionItemButton = styled(AccordionItemButton)`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #bfc1c3;
`

const StyledAccordionItem = styled(AccordionItem)`
  padding: 1px;
`

const Title = styled('span')`
  width: 97%;
`

const Count = styled('span')`
  background-color: #f8f8f8;
  border: 2px solid ${GREEN};
  border-radius: 20%;
  padding: 2px 3px;
  font-size: 14px;
`

const StyledAccordion = styled(Accordion)`
  padding: 0;
  font-size: 16px;
`

const NewsFeed = () => {
  return (
    <>
      <NewsHeader />
      <StyledAccordion allowZeroExpanded preExpanded={['a']}>
        <StyledAccordionItem uuid='a'>
          <AccordionItemHeading>
            <StyledAccordionItemButton>
              <Title>Interactions tagged</Title>
              <Count>10</Count>
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NewsCard />
          </AccordionItemPanel>
        </StyledAccordionItem>
        <StyledAccordionItem>
          <AccordionItemHeading>
            <StyledAccordionItemButton>
              <Title>Investment projects</Title>
              <Count>5</Count>
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NewsCard />
          </AccordionItemPanel>
        </StyledAccordionItem>
        <StyledAccordionItem>
          <AccordionItemHeading>
            <StyledAccordionItemButton>
              <Title>OMIS orders</Title>
              <Count>2</Count>
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NewsCard />
          </AccordionItemPanel>
        </StyledAccordionItem>
      </StyledAccordion>
    </>
  )
}



export default NewsFeed
