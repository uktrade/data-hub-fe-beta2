import _ from 'lodash'
import queryString from 'qs'
import React from 'react'
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

import { MultiInstanceForm } from './components'
import DropdownMenu from './components/DropdownMenu/ConnectedDropdownMenu'
import tasks from './components/Task/reducer'
import rootSaga from './root-saga'

import { ID as COMPANY_LISTS_STATE_ID } from './components/CompanyLists/state'
import companyListsReducer from './components/CompanyLists/reducer'

import { ID as REFERRALS_DETAILS_STATE_ID } from '../apps/companies/apps/referrals/details/client/state'
import referralsReducer from '../apps/companies/apps/referrals/details/client/reducer'

import { ID as REFERRALS_SEND_ID } from '../apps/companies/apps/referrals/send-referral/client/state'
import referralsSendReducer from '../apps/companies/apps/referrals/send-referral/client/reducer'
import * as referralsSendTasks from '../apps/companies/apps/referrals/send-referral/client/tasks'

import { ID as EXPORTS_HISTORY_ID } from '../apps/companies/apps/exports/client/ExportsHistory/state'
import exportsHistoryReducer from '../apps/companies/apps/exports/client/ExportsHistory/reducer'

import TabNav from './components/TabNav'

import ReferralList from './components/ReferralList'

import ToggleSection from './components/ToggleSection/BaseToggleSection'

import { ID as EXPORTS_WINS_ID } from '../apps/companies/apps/exports/client/ExportWins/state'
import exportWinsReducer from '../apps/companies/apps/exports/client/ExportWins/reducer'

import { ID as EXPORT_COUNTRIES_EDIT_ID } from '../apps/companies/apps/exports/client/ExportCountriesEdit/state'
import exportCountriesEditReducer from '../apps/companies/apps/exports/client/ExportCountriesEdit/reducer'

import * as addInteractionFormState from '../apps/interactions/apps/details-form/client/state'
import * as addInteractionFormTasks from '../apps/interactions/apps/details-form/client/tasks'
import addInteractionFormReducer from '../apps/interactions/apps/details-form/client/reducer'

import * as addCompanyState from '../apps/companies/apps/add-company/client/state'
import addCompanyPostcodeToRegionReducer from '../apps/companies/apps/add-company/client/reducer'

import { ID as ONE_LIST_DETAILS_ID } from '../apps/companies/apps/edit-one-list/client/state'
import editOneListReducer from '../apps/companies/apps/edit-one-list/client/reducer'

import { ID as ADD_TO_PIPELINE_ID } from '../apps/my-pipeline/client/state'
import addToPipelineReducer from '../apps/my-pipeline/client/reducer'

import { ID as PIPELINE_LIST_ID } from './components/Pipeline/state'
import pipelineListReducer from './components/Pipeline/reducer'

import { ID as INVESTEMENT_PROJECT_ADMIN_ID } from '../apps/investments/views/admin/client/state'

import investmentProjectAdminReducer from '../apps/investments/views/admin/client/reducer'

import { ID as INVESTMENT_OPPORTUNITIES_LIST_ID } from '../apps/investments/client/opportunities/List/state'
import investmentOpportunitiesListReducer from '../apps/investments/client/opportunities/List/reducer'

import { ID as INVESTMENT_OPPORTUNITIES_DETAILS_ID } from '../apps/investments/client/opportunities/Details/state'
import investmentOpportunitiesDetailsReducer from '../apps/investments/client/opportunities/Details/reducer'

import { ID as MANAGE_ADVISER_ID } from '../apps/companies/apps/advisers/client/state'
import manageAdviserReducer from '../apps/companies/apps/advisers/client/reducer'

import { ID as DNB_CHECK_ID } from '../apps/companies/apps/business-details/client/state'
import dnbCheckReducer from '../apps/companies/apps/business-details/client/reducer'

import { ID as INVESTMENT_PROFILES_ID } from '../apps/investments/client/profiles/state'
import investmentProfileReducer from '../apps/investments/client/profiles/reducer'

import { ID as INVESTMENT_PROJECTS_ID } from '../apps/investments/client/projects/state'
import investmentProjectsReducer from '../apps/investments/client/projects/reducer'

import { ID as COMPANIES_ID } from '../apps/companies/client/state'
import companiesReducer from '../apps/companies/client/reducer'

import { ID as CHECK_FOR_INVESTMENTS_ID } from './components/PersonalisedDashboard/state'
import personalDashboardReducer from './components/PersonalisedDashboard/reducer'

import { ID as MY_INVESTMENT_PROJECTS_ID } from './components/MyInvestmentProjects/state'
import myInvestmentProjectsReducer from './components/MyInvestmentProjects/reducer'

import { ID as INVESTMENT_SUMMARY_ID } from './components/InvestmentProjectSummary/state'
import investmentSummaryReducer from './components/InvestmentProjectSummary/reducer'

import { ID as DATA_SUMMARY_PICKER_ID } from './components/DataSummaryPicker/state'
import dataSummaryPickerReducer from './components/DataSummaryPicker/reducer'

import { ID as INVESTMENT_REMINDERS_ID } from './components/InvestmentReminders/state'
import investmentRemindersReducer from './components/InvestmentReminders/reducer'

import { ID as CONTACTS_ID } from '../apps/contacts/client/state'
import contactsReducer from '../apps/contacts/client/reducer'

import { ID as INTERACTIONS_ID } from '../apps/interactions/client/state'
import interactionsReducer from '../apps/interactions/client/reducer'

import { ID as EVENTS_ID } from '../apps/events/client/state'
import eventsReducer from '../apps/events/client/reducer'

import { ID as ORDERS_ID } from '../apps/omis/client/state'
import ordersReducer from '../apps/omis/client/reducer'

import CreateUKInvestmentOpportunity from './components/CreateUKInvestmentOpportunity'

import RoutedInput from './components/RoutedInput'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: queryString.stringify(
    new URL(
      document.baseURI ||
        // IE doesn't support baseURI so we need to access base.href manually
        document.querySelector('base')?.href ||
        document.location.href
    ).pathname
  ),
})

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    tasks,
    [COMPANY_LISTS_STATE_ID]: companyListsReducer,
    [COMPANIES_ID]: companiesReducer,
    [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
    [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
    [REFERRALS_SEND_ID]: referralsSendReducer,
    [EXPORTS_WINS_ID]: exportWinsReducer,
    [EXPORT_COUNTRIES_EDIT_ID]: exportCountriesEditReducer,
    [addInteractionFormState.ID]: addInteractionFormReducer,
    [ONE_LIST_DETAILS_ID]: editOneListReducer,
    [addCompanyState.ID]: addCompanyPostcodeToRegionReducer,
    [ADD_TO_PIPELINE_ID]: addToPipelineReducer,
    [PIPELINE_LIST_ID]: pipelineListReducer,
    ...TabNav.reducerSpread,
    ...ReferralList.reducerSpread,
    ...MultiInstanceForm.reducerSpread,
    ...DropdownMenu.reducerSpread,
    ...ToggleSection.reducerSpread,
    ...RoutedInput.reducerSpread,
    ...CreateUKInvestmentOpportunity.reducerSpread,
    // A reducer is required to be able to set a preloadedState parameter
    referrerUrl: (state = {}) => state,
    [INVESTEMENT_PROJECT_ADMIN_ID]: investmentProjectAdminReducer,
    [MANAGE_ADVISER_ID]: manageAdviserReducer,
    [DNB_CHECK_ID]: dnbCheckReducer,
    [INVESTMENT_OPPORTUNITIES_LIST_ID]: investmentOpportunitiesListReducer,
    [INVESTMENT_OPPORTUNITIES_DETAILS_ID]:
      investmentOpportunitiesDetailsReducer,
    [INVESTMENT_PROFILES_ID]: investmentProfileReducer,
    [INVESTMENT_PROJECTS_ID]: investmentProjectsReducer,
    [MY_INVESTMENT_PROJECTS_ID]: myInvestmentProjectsReducer,
    [CHECK_FOR_INVESTMENTS_ID]: personalDashboardReducer,
    [INVESTMENT_SUMMARY_ID]: investmentSummaryReducer,
    [DATA_SUMMARY_PICKER_ID]: dataSummaryPickerReducer,
    [INVESTMENT_REMINDERS_ID]: investmentRemindersReducer,
    [CONTACTS_ID]: contactsReducer,
    [INTERACTIONS_ID]: interactionsReducer,
    [EVENTS_ID]: eventsReducer,
    [ORDERS_ID]: ordersReducer,
  }),
  {
    referrerUrl: window.document.referrer,
    Form: {
      [addInteractionFormState.ID]: {
        values: {},
        touched: {},
        errors: {},
        fields: {},
        steps: [],
        currentStep: 0,
        ...addInteractionFormTasks.restoreState(),
      },
      [REFERRALS_SEND_ID]: {
        values: {},
        touched: {},
        errors: {},
        fields: {},
        steps: [],
        currentStep: 0,
        ...referralsSendTasks.restoreState(),
      },
    },
  },
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
)

const runMiddlewareOnce = _.once((tasks) => sagaMiddleware.run(rootSaga(tasks)))

/**
 * Provides state management and routing infrastructure required by the
 * stateful/routed components.
 * @param {Object} props
 * @param {Object} props.tasks - A map of _task_ names to _tasks_, if required
 * by the wrapped components.
 * @example
 * import ReferralList from 'components/ReferralList'
 * import dummyReferralListTask from 'components/ReferralList/task/dummy'
 *
 * // ReferralList is a stateful component,
 * // which also requires the Referrals task.
 * <DataHubProvider task={{ Referrals: dummyReferralListTask() }}>
 *    <ReferralList id="foo"/>
 * </DataHubProvider>
 */
export default class DataHubProvider extends React.Component {
  constructor(...args) {
    super(...args)
    // We only ever want to start the sagas once
    runMiddlewareOnce(this.props.tasks || {})
  }
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {this.props.children}
        </ConnectedRouter>
      </Provider>
    )
  }
}
