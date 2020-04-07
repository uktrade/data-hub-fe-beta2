import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
} from 'connected-react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import AddInteractionForm from '../apps/interactions/apps/add-interaction/client/AddInteractionForm'
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
import ExportsHistory from '../apps/companies/apps/exports/client/ExportsHistory/'
import ExportsEdit from '../apps/companies/apps/exports/client/ExportsEdit.jsx'
import ExportCountriesEdit from '../apps/companies/apps/exports/client/ExportCountriesEdit/'
import ReferralDetails from '../apps/companies/apps/referrals/details/client/ReferralDetails'
import ReferralHelp from '../apps/companies/apps/referrals/help/client/ReferralHelp'
import SendReferralForm from '../apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import sendReferral from '../apps/companies/apps/referrals/send-referral/client/reducer'
import InteractionReferralDetails from '../apps/companies/apps/referrals/details/client/InteractionReferralDetails.jsx'
import Contacts from '../apps/contacts/client/Contacts.jsx'

import tasksSaga from './components/Task/saga'
import tasks from './components/Task/reducer'

import { ID as COMPANY_LISTS_STATE_ID } from './components/CompanyLists/state'
import companyListsReducer from './components/CompanyLists/reducer'
import * as companyListsTasks from './components/CompanyLists/tasks'

import { ID as REFERRALS_DETAILS_STATE_ID } from '../apps/companies/apps/referrals/details/client/state'
import referralsReducer from '../apps/companies/apps/referrals/details/client/reducer'
import * as referralTasks from '../apps/companies/apps/referrals/details/client/tasks'

import { ID as EXPORTS_HISTORY_ID } from '../apps/companies/apps/exports/client/ExportsHistory/state'
import exportsHistoryReducer from '../apps/companies/apps/exports/client/ExportsHistory/reducer'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/client/ExportsHistory/tasks'

import TabNav from './components/TabNav'
import referralListTask from './components/ReferralList/task'
import ReferralList from './components/ReferralList'
import Dashboard from './components/Dashboard'

import { ID as EXPORTS_WINS_ID } from '../apps/companies/apps/exports/client/ExportWins/state'
import exportWinsReducer from '../apps/companies/apps/exports/client/ExportWins/reducer'
import * as exportWinsTasks from '../apps/companies/apps/exports/client/ExportWins/tasks'

import {
  ID as EXPORT_COUNTRIES_EDIT_ID,
  TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME,
} from '../apps/companies/apps/exports/client/ExportCountriesEdit/state'
import exportCountriesEditReducer from '../apps/companies/apps/exports/client/ExportCountriesEdit/reducer'
import * as exportCountriesEditTasks from '../apps/companies/apps/exports/client/ExportCountriesEdit/tasks'

import {
  ID as AUDIT_HISTORY_ID,
  TASK_NAME as AUDIT_HISTORY_NAME,
} from '../apps/contacts/client/components/audit-history/state'
import auditHistoryReducer from '../apps/contacts/client/components/audit-history/reducer'
import auditHistoryTask from '../apps/contacts/client/components/audit-history/tasks'
import ContactDetails from '../apps/contacts/client/Details'
import contactDetailsTask from '../apps/contacts/client/Details/task'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: new URL(document.baseURI).pathname,
})

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    tasks,
    sendReferral,
    [COMPANY_LISTS_STATE_ID]: companyListsReducer,
    [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
    [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
    ...TabNav.reducerSpread,
    ...ReferralList.reducerSpread,
    ...ContactDetails.reducerSpread,
    [EXPORTS_WINS_ID]: exportWinsReducer,
    // A reducer is required to be able to set a preloadedState parameter
    referrerUrl: (state = {}) => state,
    [EXPORT_COUNTRIES_EDIT_ID]: exportCountriesEditReducer,
    [AUDIT_HISTORY_ID]: auditHistoryReducer,
  }),
  { referrerUrl: window.document.referrer },
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
)

sagaMiddleware.run(
  tasksSaga({
    'Company lists': companyListsTasks.fetchCompanyLists,
    'Company list': companyListsTasks.fetchCompanyList,
    'Exports history': exportsHistoryTasks.fetchExportsHistory,
    'Referral details': referralTasks.fetchReferralDetails,
    Referrals: referralListTask,
    'Export wins': exportWinsTasks.fetchExportWins,
    [EXPORT_COUNTRIES_EDIT_NAME]: exportCountriesEditTasks.saveExportCountries,
    [AUDIT_HISTORY_NAME]: auditHistoryTask,
    'Contact details': contactDetailsTask,
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
      <ConnectedRouter history={history}>
        <Mount selector="#add-company-form">
          {(props) => (
            <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#add-interaction-form">
          {(props) => (
            <AddInteractionForm csrfToken={globalProps.csrfToken} {...props} />
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
          {(props) => (
            <CannotFindMatch csrfToken={globalProps.csrfToken} {...props} />
          )}
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
          <Dashboard id="homepage" />
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
            <CreateListFormSection
              csrfToken={globalProps.csrfToken}
              {...props}
            />
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
        <Mount selector="#send-referral-form">
          {(props) => (
            <SendReferralForm {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#company-export-full-history">
          {(props) => <ExportsHistory {...props} />}
        </Mount>
        <Mount selector="#referral-details">
          {(props) => <ReferralDetails {...props} />}
        </Mount>
        <Mount selector="#referral-help">
          {(props) => <ReferralHelp {...props} />}
        </Mount>
        <Mount selector="#company-exports-edit">
          {(props) => <ExportsEdit {...props} />}
        </Mount>
        <Mount selector="#interaction-referral-details">
          {(props) => <InteractionReferralDetails {...props} />}
        </Mount>
        <Mount selector="#company-export-countries-edit">
          {(props) => <ExportCountriesEdit {...props} />}
        </Mount>
        <Mount selector="#contacts">{(props) => <Contacts {...props} />}</Mount>
      </ConnectedRouter>
    </Provider>
  )
}

ReactDOM.render(<App />, appWrapper)
