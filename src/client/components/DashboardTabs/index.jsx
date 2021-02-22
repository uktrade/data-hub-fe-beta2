import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import CompanyLists from '../CompanyLists'
import ReferralList from '../ReferralList'
import Pipeline from '../Pipeline'
import MyInvestmentProjects from '../MyInvestmentProjects'
import TabNav from '../TabNav'

const StyledDiv = styled('div')`
  padding-top: 16px;
`

const DashboardTabs = ({ id, adviser }) => (
  <StyledDiv data-cy="dashboard-tabs">
    <TabNav
      id={`${id}.TabNav`}
      label="Dashboard"
      routed={true}
      tabs={{
        [urls.personalisedDashboard.myInvestmentProjects()]: {
          label: 'My projects',
          content: <MyInvestmentProjects adviser={adviser} />,
        },
        [urls.dashboard()]: {
          label: 'My companies lists',
          content: <CompanyLists />,
        },
        [urls.companies.referrals.list()]: {
          label: 'My referrals',
          content: <ReferralList id={`${id}:ReferralList`} />,
        },
        [urls.pipeline.index()]: {
          label: 'My pipeline',
          content: <Pipeline />,
        },
      }}
    />
  </StyledDiv>
)

DashboardTabs.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
}

export default DashboardTabs