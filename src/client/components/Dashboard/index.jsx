import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'

import urls from '../../../lib/urls'
import CompanyLists from '../../components/CompanyLists'
import ReferralList from '../../components/ReferralList'
import Pipeline from '../../components/Pipeline'
import TabNav from '../../components/TabNav'

import D3Experiment from '../../components/D3Experiment'

const StyledDiv = styled('div')`
  border-top: 4px solid ${GREY_2};
  padding-top: 16px;
`

const Dashboard = ({ id }) => (
  <StyledDiv>
    <D3Experiment />
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
  </StyledDiv>
)

Dashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Dashboard
