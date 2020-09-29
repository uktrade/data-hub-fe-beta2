import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import dateFns from 'date-fns'
import { Spinner } from 'govuk-react'

import { apiProxyAxios } from '../../../client/components/Task/utils'
import { Tag } from '../../../client/components'

import NewsFeedHeader from './NewsFeedHeader'

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
    margin-bottom: 20px;
  }
`

const Title = styled('span')`
  width: 97%;
`

const Count = styled('span')`
  padding: 2px 3px;
  font-size: 14px;
`

const StyledAccordion = styled(Accordion)`
  padding: 0;
  font-size: 16px;
`

const InteractionTitle = styled('div')`
  font-weight: bold;
  font-size: 16px;
`
const InteractionDate = styled('div')`
  font-size: 14px;
  margin: 10px 0;
`
const InteractionKind = styled('div')`
  font-size: 14px;
  margin: 5px 0;
`

const InvestmentProjectTitle = styled('div')`
  font-weight: bold;
  font-size: 16px;
`
const InvestmentProjectModifiedDate = styled('div')`
  font-size: 14px;
  margin: 5px 0;
`
const InvestmentProjectStatus = styled('div')`
  font-size: 14px;
  margin: 5px 0;
`

const StyledSpinner = styled(Spinner)`
  width: 20px;
  height: 20px;
`

const NewsHeader = ({ title, number }) => (
  <AccordionItemHeading>
    <StyledAccordionItemButton>
      <Title>{title}</Title>
      {number ? (
        <Tag colour="green">
          <Count>{number}</Count>
        </Tag>
      ) : (
        <StyledSpinner />
      )}
    </StyledAccordionItemButton>
  </AccordionItemHeading>
)

const NewsFeed = () => {
  const [interactions, setInteractions] = useState([])
  const [investments, setInvestments] = useState([])
  const [omis, setOmis] = useState([])

  const transformInteraction = ({ data }) => {
    return data.results
      .filter(
        (data) =>
          data.kind === 'interaction' || data.kind === 'service_delivery'
      )
      .map((interaction) => {
        return {
          name: interaction.company.name,
          date: interaction.date,
          kind: interaction.kind,
          id: interaction.id,
        }
      })
  }

  const transformInvestments = ({ data }) => {
    return data.results.map((investment) => {
      return {
        name: investment.name,
        id: investment.id,
        status: investment.status,
        updated: investment.modified_on,
      }
    })
  }

  const transformOrders = ({ data }) => {
    return data.results.map((order) => {
      return {
        orderNumber: order.reference,
        companyName: order.company.name,
        updated: order.modified_on,
        status: order.status,
        id: order.id,
      }
    })
  }

  useEffect(() => {
    const fetchInteractionData = async () => {
      const interactionResponse = await apiProxyAxios.post(
        'v4/search/export-country-history',
        {
          country: '9f5f66a0-5d95-e211-a939-e4115bead28a',
        }
      )
      const investmentsResponse = await apiProxyAxios.post(
        'v3/search/investment_project',
        {
          country_investment_originates_from:
            '9f5f66a0-5d95-e211-a939-e4115bead28a',
        }
      )

      const omisResponse = await apiProxyAxios.post('v3/search/order', {
        primary_market: '9f5f66a0-5d95-e211-a939-e4115bead28a',
      })

      setInvestments(transformInvestments(investmentsResponse))
      setInteractions(transformInteraction(interactionResponse))
      setOmis(transformOrders(omisResponse))
    }
    fetchInteractionData()
  }, [])

  return (
    <>
      <NewsFeedHeader />
      <StyledAccordion allowZeroExpanded preExpanded={['a']}>
        <StyledAccordionItem uuid="a">
          <NewsHeader
            title="Interactions tagged"
            number={interactions.length}
          />
          {interactions.map((interaction) => (
            <StyledAccordionItemPanel key={interaction.id}>
              <InteractionTitle>
                <a href={`/interactions/${interaction.id}`}>
                  {interaction.name}
                </a>
              </InteractionTitle>
              <InteractionDate>
                Created: {dateFns.format(interaction.date, 'D MMM YYYY')}
              </InteractionDate>
              <Tag colour="grey">
                <InteractionKind>
                  {interaction.kind.replace('_', ' ')}
                </InteractionKind>
              </Tag>
            </StyledAccordionItemPanel>
          ))}
        </StyledAccordionItem>
        <StyledAccordionItem>
          <NewsHeader title="Investment projects" number={investments.length} />
          {investments.map((investment) => (
            <StyledAccordionItemPanel key={investment.id}>
              <InvestmentProjectTitle>
                <a href={`/investments/projects/${investment.id}`}>
                  {investment.name}
                </a>
              </InvestmentProjectTitle>
              <InvestmentProjectModifiedDate>
                Modified: {dateFns.format(investment.updated, 'D MMM YYYY')}
              </InvestmentProjectModifiedDate>
              <Tag colour={investment.status === 'ongoing' ? 'blue' : 'orange'}>
                <InvestmentProjectStatus>
                  {investment.status}
                </InvestmentProjectStatus>
              </Tag>
            </StyledAccordionItemPanel>
          ))}
        </StyledAccordionItem>
        <StyledAccordionItem>
          <NewsHeader title="Omis orders" number={omis.length} />
          {omis.map((omis) => (
            <StyledAccordionItemPanel key={omis.id}>
              <InvestmentProjectTitle>
                <a href={`/omis/${omis.id}/work-order`}>{omis.orderNumber}</a>
              </InvestmentProjectTitle>
              <InvestmentProjectModifiedDate>
                Modified: {dateFns.format(omis.updated, 'D MMM YYYY')}
              </InvestmentProjectModifiedDate>
              <Tag colour={omis.status === 'ongoing' ? 'blue' : 'orange'}>
                <InvestmentProjectStatus>{omis.status}</InvestmentProjectStatus>
              </Tag>
            </StyledAccordionItemPanel>
          ))}
        </StyledAccordionItem>
      </StyledAccordion>
    </>
  )
}

export default NewsFeed
