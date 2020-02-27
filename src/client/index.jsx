import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import CompanyActivityFeed from '../apps/companies/apps/activity-feed/client/CompanyActivityFeed'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import EditHistory from '../apps/companies/apps/edit-history/client/EditHistory'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CannotFindMatch from '../apps/companies/apps/match-company/client/CannotFindMatch'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListFormSection from '../apps/company-lists/client/CreateListFormSection'
import AddRemoveFromListSection from '../apps/company-lists/client/AddRemoveFromListSection'
import DnbHierarchy from '../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import LeadAdvisers from '../apps/companies/apps/advisers/client/LeadAdvisers'
import LargeCapitalProfileCollection from '../apps/investments/client/LargeCapitalProfileCollection'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import ExportsIndex from '../apps/companies/apps/exports/client/ExportsIndex'
import ExportsFullHistory from '../apps/companies/apps/exports/client/ExportsFullHistory'
import ReferralDetails from '../apps/referrals/apps/details/client/ReferralDetails'
import ReferralHelp from '../apps/referrals/apps/help/client/ReferralHelp'
import ValidatedInput from './components/ValidatedInput'

import tasksSaga from './components/Task/saga'
import tasks from './components/Task/reducer'

import CompanyLists from './components/CompanyLists'
import companyListsReducer from './components/CompanyLists/reducer'
import referralsReducer from '../apps/referrals/apps/details/client/reducer'
import { ID as COMPANY_LISTS_STATE_ID } from './components/CompanyLists/state'
import { ID as REFERRALS_DETAILS_STATE_ID } from '../apps/referrals/apps/details/client/state'
import * as companyListsTasks from './components/CompanyLists/tasks'
import exportsHistoryReducer from '../apps/companies/apps/exports/reducer'
import { ID as EXPORTS_HISTORY_ID } from '../apps/companies/apps/exports/state'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/tasks'
import * as referralTasks from '../apps/referrals/apps/details/client/tasks'
import TabNav from './components/TabNav'
import referralList from './components/ReferralList/reducer'
import referralListTask from './components/ReferralList/task'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({
    tasks,
    referralList,
    [COMPANY_LISTS_STATE_ID]: companyListsReducer,
    [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
    [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
    ...ValidatedInput.reducerSpread,
    ...TabNav.reducerSpread,
  }),
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(
  tasksSaga({
    'Company lists': companyListsTasks.fetchCompanyLists,
    'Company list': companyListsTasks.fetchCompanyList,
    'Exports history': exportsHistoryTasks.fetchExportsHistory,
    'Referral details': referralTasks.fetchReferralDetails,
    Referrals: referralListTask,
  })
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
      <Mount selector="#cannot-find-match">
        {(props) => <CannotFindMatch {...props} />}
      </Mount>
      <Mount selector="#find-company">
        {(props) => (
          <FindCompany csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#activity-feed-app">
        {(props) => <CompanyActivityFeed {...props} />}
      </Mount>
      <Mount selector="#company-lists">
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
      <Mount selector="#company-export-index-page">
        {(props) => <ExportsIndex {...props} />}
      </Mount>
      <Mount selector="#company-export-full-history">
        {(props) => <ExportsFullHistory {...props} />}
      </Mount>
      <Mount selector="#referral-details">
        {(props) => <ReferralDetails {...props} />}
      </Mount>
      <Mount selector="#referral-help">
        {(props) => <ReferralHelp {...props} />}
      </Mount>
    </Provider>
  )
}

ReactDOM.render(<App />, appWrapper)
