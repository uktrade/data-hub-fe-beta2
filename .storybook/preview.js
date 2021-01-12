import React from 'react'
import { addDecorator, configure, addParameters } from '@storybook/react'
import { addReadme } from 'storybook-readme'
import { FONT_SIZE, FONT_STACK, MEDIA_QUERIES } from '@govuk-react/constants'
import { createGlobalStyle } from 'styled-components'

const req = require.context('../src', true, /.*\.stories\.(js|jsx)$/)

import DataHubProvider from '../src/client/provider'
import referralsTask from '../src/client/components/ReferralList/tasks/dummy/spread'
import companyListsTasks from '../src/client/components/CompanyLists/tasks/dummy/spread'
import taskStoriesTasks from '../src/client/components/Task/__stories__/tasks.js'

const GlobalStyle = createGlobalStyle`
  body {
    font: ${FONT_SIZE.SIZE_16} ${FONT_STACK};

    ${MEDIA_QUERIES.TABLET} {
      font: ${FONT_SIZE.SIZE_19} ${FONT_STACK};
    }
  }
`

addParameters({
  options: {
    theme: {}
  },
})

addDecorator(addReadme)
addDecorator(s =>
  <>
    <GlobalStyle />
    <DataHubProvider tasks={{
      ...referralsTask(),
      ...companyListsTasks(),
      ...taskStoriesTasks,
    }}>
      {s()}
    </DataHubProvider>
  </>
)

configure(req, module);
