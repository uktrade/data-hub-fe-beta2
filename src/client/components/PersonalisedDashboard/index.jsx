import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import Aside from './Aside.jsx'
import Main from './Main.jsx'

import {
  UserDetails,
  InvestmentReminders,
  InvestmentProjectSummary,
  Search,
  InvestmentUpcomingDates,
  DashboardTabs,
  Container,
} from '../../components'

const PersonalisedDashboard = ({ id, adviser }) => {
  return (
    <Container>
      <GridRow data-test="dashboard">
        <GridCol setWidth="one-third">
          <Aside>
            <UserDetails {...adviser} />
            <InvestmentReminders />
            <InvestmentProjectSummary adviser={adviser} />
          </Aside>
        </GridCol>
        <GridCol setWidth="two-thirds">
          <Main>
            <Search />
            <InvestmentUpcomingDates />
            <DashboardTabs id={id} adviser={adviser} />
          </Main>
        </GridCol>
      </GridRow>
    </Container>
  )
}

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
}

export default PersonalisedDashboard
