/* eslint no-unused-vars:0 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import { ActivityFeedApp } from 'data-hub-components'
import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import EditHistory from '../apps/companies/apps/edit-history/client/EditHistory'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CompanyLists from '../apps/dashboard/client/CompanyLists'
import companyLists, {
  resolvePreloadedData as resolvePreloadedCompanyListsData,
} from '../apps/dashboard/client/CompanyLists/reducer'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListFormSection from '../apps/company-lists/client/CreateListFormSection'
import AddRemoveFromListSection from '../apps/company-lists/client/AddRemoveFromListSection'
import DnbHierarchy from '../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import LeadAdvisers from '../apps/companies/apps/advisers/client/LeadAdvisers'
import LargeCapitalProfileCollection from '../apps/investments/client/LargeCapitalProfileCollection'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import CompanyExportCountries from '../apps/companies/apps/exports/client/CompanyExportCountries'

const store = createStore(
  combineReducers({ companyLists }),
  {
    companyLists: resolvePreloadedCompanyListsData(),
  },
  process.env.NODE_ENV === 'production'
    ? undefined
    : require('redux-devtools-extension').devToolsEnhancer()
)

const appWrapper = document.getElementById('react-app')

function parseProps(domNode) {
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

function Mount({ selector, children }) {
  return [...document.querySelectorAll(selector)].map((domNode) => {
    const props = parseProps(domNode)
    return ReactDOM.createPortal(
      typeof children === 'function' ? children(props) : children,
      domNode
    )
  })
}

function App() {
  const globalProps = parseProps(appWrapper)
  return (
    <Provider store={store}>
      <Mount selector="#add-company-form">
        {(props) => (
          <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#edit-company-form">
        {(props) => (
          <EditCompanyForm csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#edit-history">
        {(props) => (
          <EditHistory csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#match-confirmation">
        {(props) => (
          <MatchConfirmation csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#find-company">
        {(props) => (
          <FindCompany csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#activity-feed-app">
        {(props) => <ActivityFeedApp {...props} />}
      </Mount>
      <Mount selector="#my-companies">
        <CompanyLists />
      </Mount>
      <Mount selector="#delete-company-list">
        {(props) => (
          <DeleteCompanyList csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#edit-company-list">
        {(props) => (
          <EditCompanyList csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#create-company-list-form">
        {(props) => (
          <CreateListFormSection csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#add-remove-list-form">
        {(props) => <AddRemoveFromListSection {...props} />}
      </Mount>
      <Mount selector="#lead-advisers">
        {(props) => <LeadAdvisers {...props} />}
      </Mount>
      <Mount selector="#dnb-hierarchy">
        {(props) => <DnbHierarchy {...props} />}
      </Mount>
      <Mount selector="#company-business-details">
        {(props) => <CompanyBusinessDetails {...props} />}
      </Mount>
      <Mount selector="#large-capital-profile-collection">
        {(props) => <LargeCapitalProfileCollection {...props} />}
      </Mount>
      <Mount selector="#manage-adviser">
        {(props) => (
          <ManageAdviser {...props} csrfToken={globalProps.csrfToken} />
        )}
      </Mount>
      <Mount selector="#company-export-countries">
        {(props) => (
          <CompanyExportCountries
            {...props}
            csrfToken={globalProps.csrfToken}
          />
        )}
      </Mount>
    </Provider>
  )
}

ReactDOM.render(<App />, appWrapper)
