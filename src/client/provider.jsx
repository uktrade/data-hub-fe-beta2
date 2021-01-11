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

import MultiInstanceForm from './components/Form/MultiInstanceForm'
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

import ToggleSection from './components/ToggleSection'

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

import { ID as MANAGE_ADVISER_ID } from '../apps/companies/apps/advisers/client/state'
import manageAdviserReducer from '../apps/companies/apps/advisers/client/reducer'

import { ID as DNB_CHECK_ID } from '../apps/companies/apps/business-details/client/state'
import dnbCheckReducer from '../apps/companies/apps/business-details/client/reducer'

import { ID as INVESTMENT_PROFILES_ID } from '../apps/investments/client/profiles/state'
import investmentProfileReducer from '../apps/investments/client/profiles/reducer'

import { ID as INVESTMENT_PROJECTS_ID } from '../apps/investments/client/projects/state'
import investmentProjectsReducer from '../apps/investments/client/projects/reducer'

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
    // A reducer is required to be able to set a preloadedState parameter
    referrerUrl: (state = {}) => state,
    [INVESTEMENT_PROJECT_ADMIN_ID]: investmentProjectAdminReducer,
    [MANAGE_ADVISER_ID]: manageAdviserReducer,
    [DNB_CHECK_ID]: dnbCheckReducer,
    [INVESTMENT_PROFILES_ID]: investmentProfileReducer,
    [INVESTMENT_PROJECTS_ID]: investmentProjectsReducer,
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
