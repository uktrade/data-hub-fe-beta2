import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import exampleReadme from './example.md'
import usageReadme from './usage.md'

import { formatWithTime } from '../../../utils/date-utils'
import { currencyGBP } from '../../../utils/number-utils'

import lgCapOpps from '../../../../../test/sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json'
import { transformInvestmentOpportunityDetails } from '../../../../apps/investments/client/opportunities/Details/transformers'

const StyledHeaderDetails = styled('div')`
  background-color: ${GREY_4};
`

const StyledHeaderList = styled('li')`
  display: inline-block;
  padding-right: ${SPACING.SCALE_5};
`

const StyledHeaderListLabel = styled('label')`
  color: #6f777b;
`

const { detailsFields, incompleteDetailsFields } = transformInvestmentOpportunityDetails(lgCapOpps)
const {
  createdOn,
  ukRegions,
  assetClasses,
  opportunityValue,
} = detailsFields

const statusLabel = incompleteDetailsFields > 0 ? 'Unassigned' : 'Seeking investment'
const oppsValue = opportunityValue.value == null ? 'Not yet valued' : `${currencyGBP(opportunityValue.value)}`;
const ukLocation = ukRegions.length == 0 ? 'Not yet defined' :
                      ukRegions.length > 1 ? 'Multiple' : `${ukRegions.map(v => v.label)}`;
const assetClass = assetClasses.length == 0 ? 'Not yet defined' : 
                      assetClasses.length > 1 ? 'Multiple' : `${assetClasses.map(c => c.label)}`;

const items = {
  'Status': [{'label': `${statusLabel}`, 'value': ''}],
  'Value': `${oppsValue}`,
  'UK location': `${ukLocation}`,
  'Asset value': `${assetClass}`,
  'Created on': `${formatWithTime(createdOn)}`,
}

storiesOf('Local Header Details', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <StyledHeaderDetails
      aria-label="local header details"
      data-auto-id="localHeaderDetails"
      role="region"
    >
      { Object.entries(items).map(item => {
        return (
          <StyledHeaderList key={item[0]}>
            <StyledHeaderListLabel>{item[0]}</StyledHeaderListLabel>
              { item[1][0].length ? <p>{item[1]}</p> : 
                  <p>{item[1][0].label} -&nbsp;
                    <a href={item[1][0].value}>change</a>
                  </p>
              }
          </StyledHeaderList>
          )
        })
      }
    </StyledHeaderDetails>
  ))
