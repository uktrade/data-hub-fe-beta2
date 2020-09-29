import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'
import { GridRow, GridCol } from 'govuk-react'

import urls from '../../../lib/urls'
import CompanyLists from '../../components/CompanyLists'
import ReferralList from '../../components/ReferralList'
import Pipeline from '../../components/Pipeline'
import TabNav from '../../components/TabNav'
import NewsFeed from '../../components/NewsFeed'

const StyledDiv = styled('div')`
  border-top: 4px solid ${GREY_2};
  padding-top: 16px;
`

const Dashboard = ({ id }) => (
  <StyledDiv>
    <GridRow>
      <GridCol setWidth="two-thirds">
        <TabNav
          id={`${id}.TabNav`}
          label="Dashboard"
          routed={true}
          tabs={{
            [urls.dashboard.mountPoint]: {
              label: 'My companies lists',
              content: <CompanyLists />,
            },
            [urls.companies.referrals.list.mountPoint]: {
              label: 'My referrals',
              content: <ReferralList id={`${id}:ReferralList`} />,
            },
            [urls.pipeline.index.mountPoint]: {
              label: 'My pipeline',
              content: <Pipeline />,
            },
          }}
        />
      </GridCol>
      <GridCol setWidth="one-third">
        <NewsFeed />
      </GridCol>
    </GridRow>
  </StyledDiv>
)

Dashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Dashboard
