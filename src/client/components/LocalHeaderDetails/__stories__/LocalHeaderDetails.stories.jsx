import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import exampleReadme from './example.md'
import usageReadme from './usage.md'

import lgCapOpps from '../../../../../test/sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json'

const StyledHeaderDetails = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_4};
  padding-top: ${SPACING.SCALE_3};
`

const StyledHeaderList = styled('li')`
  display: inline-block;
  padding: ${SPACING.SCALE_2};
`
const StyledHeaderListLabel = styled('label')`
  color: #6f777b;
`

const items = {
  'Status': [{'label': 'Unassigned', 'value': 'someHttpKeys'}],
  'Value': 'Not yet valued',
  'UK location': 'Not yet defined',
  'Asset value': 'Not yet defined',
  'Created on': '16 Jan 2019, 1:35pm',
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
