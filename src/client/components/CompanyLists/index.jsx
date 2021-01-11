import { orderBy as _orderBy } from 'lodash'
import HintText from '@govuk-react/hint-text'
import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANY_LISTS__LISTS_LOADED,
  COMPANY_LISTS__COMPANIES_LOADED,
} from '../../actions'
import SpacedSectionBreak from '../SpacedSectionBreak'
import ContentWithHeading from '../ContentWithHeading'
import { TaskStatus } from '../Task'
import Filters, { ALPHABETICAL, LEAST_RECENT, RECENT } from './Filters'
import Header from './Header'
import ListHeader from './ListHeader'
import Table from './Table'
import { state2props } from './state'

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
  <section>
    <Header />
    <SpacedSectionBreak />
    <ListHeader id={id} name={name} />
    <TaskStatus
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
    </TaskStatus>
  </section>
))

const EmptyState = () => (
  <ContentWithHeading heading="My companies lists">
    <HintText>
      You have not yet created any lists with companies.
      <br />
      You can add companies to lists from a company page, and only you can see
      these lists.
    </HintText>
  </ContentWithHeading>
)

export default connect(state2props)(({ lists }) =>
  lists ? (
    Object.keys(lists).length ? (
      <CompanyList />
    ) : (
      <EmptyState />
    )
  ) : (
    <TaskStatus
      name="Company lists"
      id="dashboard"
      progressMessage="Loading my companies lists"
      startOnRender={{ onSuccessDispatch: COMPANY_LISTS__LISTS_LOADED }}
    />
  )
)
