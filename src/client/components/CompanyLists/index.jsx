import { orderBy as _orderBy } from 'lodash'
import { SPACING } from '@govuk-react/constants'
import HintText from '@govuk-react/hint-text'
import SectionBreak from '@govuk-react/section-break'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import {
  COMPANY_LISTS__LISTS_LOADED,
  COMPANY_LISTS__COMPANIES_LOADED,
} from '../../actions'
import Task from '../Task'
import Filters, { ALPHABETICAL, LEAST_RECENT, RECENT } from './Filters'
import Header from './Header'
import ListHeader from './ListHeader'
import Table from './Table'
import { state2props } from './state'
import ReferralList from '../ReferralList'

const StyledSectionBreak = styled(SectionBreak)({
  marginBottom: SPACING.SCALE_3,
})

const applyFilters = (companies, query, orderBy) =>
  _orderBy(
    companies.filter((c) => c.name.match(new RegExp(query, 'i'))),
    ...{
      [RECENT]: [(c) => c.date || '', 'desc'],
      [LEAST_RECENT]: [(c) => c.date || '', 'asc'],
      [ALPHABETICAL]: [(c) => c.name, 'asc'],
    }[orderBy]
  )

const CompanyList = connect((state) => {
  const { lists, selectedId, orderBy, query } = state2props(state)
  return {
    ...lists[selectedId],
    id: selectedId,
    orderBy,
    query,
  }
})(({ id, name, companies, query, orderBy }) => (
  <div>
    <ListHeader id={id} name={name} />
    <Task.Status
      name="Company list"
      id={id}
      progressMessage="loading companies"
      startOnRender={{
        payload: id,
        onSuccessDispatch: COMPANY_LISTS__COMPANIES_LOADED,
      }}
    >
      {() =>
        companies && companies.length ? (
          <>
            {companies.length > 1 && <Filters />}
            <Table companies={applyFilters(companies, query, orderBy)} />
          </>
        ) : (
          <HintText>
            You have not added any companies to your list.
            <br />
            You can add companies to this list from a company page, and only you
            can see this list.
          </HintText>
        )
      }
    </Task.Status>
  </div>
))

const MyCompanies = connect(state2props)(({ lists }) =>
  lists ? (
    <>
      <Header />
      <StyledSectionBreak />
      {Object.keys(lists).length ? (
        <CompanyList />
      ) : (
        <HintText>
          You have not yet created any lists with companies.
          <br />
          You can add companies to lists from a company page, and only you can
          see these lists.
        </HintText>
      )}
    </>
  ) : (
    <Task.Status
      name="Company lists"
      id="dashboard"
      progressMessage="Loading my companies lists"
      startOnRender={{ onSuccessDispatch: COMPANY_LISTS__LISTS_LOADED }}
    />
  )
)

import TabNav from '../TabNav'

export default () => (
  <TabNav
    id="homepage"
    selectedIndex={0}
    tabs={[
      {
        label: 'My companies lists',
        content: <MyCompanies />,
      },
      {
        label: 'My Referrals',
        content: <ReferralList id="foo" />,
      },
    ]}
  />
)
