import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import Provider from './provider'
import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import InteractionDetailsForm from '../apps/interactions/apps/details-form/client/InteractionDetailsForm'
import CompanyActivityFeed from '../apps/companies/apps/activity-feed/client/CompanyActivityFeed'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import CompanyEditHistory from '../apps/companies/apps/edit-history/client/CompanyEditHistory'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CannotFindMatch from '../apps/companies/apps/match-company/client/CannotFindMatch'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListFormSection from '../apps/company-lists/client/CreateListFormSection'
import AddRemoveFromListSection from '../apps/company-lists/client/AddRemoveFromListSection'
import DnbHierarchy from '../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import LeadAdvisers from '../apps/companies/apps/advisers/client/LeadAdvisers'
import LargeCapitalProfileCollection from '../apps/investments/client/profiles/LargeCapitalProfileCollection'
import InvestmentEditHistory from '../apps/investments/client/InvestmentEditHistory'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import EditOneListForm from '../apps/companies/apps/edit-one-list/client/EditOneListForm'
import ExportsIndex from '../apps/companies/apps/exports/client/ExportsIndex'
import ExportsHistory from '../apps/companies/apps/exports/client/ExportsHistory/'
import ExportsEdit from '../apps/companies/apps/exports/client/ExportsEdit.jsx'
import ExportCountriesEdit from '../apps/companies/apps/exports/client/ExportCountriesEdit/'
import ReferralDetails from '../apps/companies/apps/referrals/details/client/ReferralDetails'
import ReferralHelp from '../apps/companies/apps/referrals/help/client/ReferralHelp'
import SendReferralForm from '../apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import InteractionReferralDetails from '../apps/companies/apps/referrals/details/client/InteractionReferralDetails.jsx'
import PipelineForm from '../apps/my-pipeline/client'
import InvestmentProjectAdmin from '../apps/investments/views/admin/client/InvestmentProjectAdmin.jsx'
import FlashMessages from './components/LocalHeader/FlashMessages.jsx'
import ArchivePipelineItemForm from '../apps/my-pipeline/client/ArchivePipelineItemForm.jsx'
import UnarchivePipelineItemForm from '../apps/my-pipeline/client/UnarchivePipelineItemForm.jsx'
import DeletePipelineItemForm from '../apps/my-pipeline/client/DeletePipelineItemForm.jsx'
import Dashboard from './components/Dashboard'
import PersonalisedDashboard from './components/PersonalisedDashboard'
import CompanyLocalHeader from './components/CompanyLocalHeader'
import InvestmentProjectsCollection from '../apps/investments/client/projects/ProjectsCollection.jsx'
import Opportunities from '../apps/investments/client/opportunities/Opportunities.jsx'
import IEBanner from '../apps/dashboard/client/IEBanner'

import * as companyListsTasks from './components/CompanyLists/tasks'
import * as referralTasks from '../apps/companies/apps/referrals/details/client/tasks'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/client/ExportsHistory/tasks'
import referralListTask from './components/ReferralList/tasks'
import {
  TASK_OPEN_REFERRALS_CONTACT_FORM,
  TASK_SAVE_REFERRAL,
} from '../apps/companies/apps/referrals/send-referral/client/state'
import * as referralsSendTasks from '../apps/companies/apps/referrals/send-referral/client/tasks'
import * as exportWinsTasks from '../apps/companies/apps/exports/client/ExportWins/tasks'
import { TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME } from '../apps/companies/apps/exports/client/ExportCountriesEdit/state'
import * as exportCountriesEditTasks from '../apps/companies/apps/exports/client/ExportCountriesEdit/tasks'
import addCompanyPostcodeToRegionTask from '../apps/companies/apps/add-company/client/tasks'
import { TASK_SAVE_ONE_LIST_DETAILS } from '../apps/companies/apps/edit-one-list/client/state'
import * as editOneListTasks from '../apps/companies/apps/edit-one-list/client/tasks'
import {
  TASK_GET_PIPELINE_BY_COMPANY,
  TASK_ADD_COMPANY_TO_PIPELINE,
  TASK_GET_PIPELINE_ITEM,
  TASK_EDIT_PIPELINE_ITEM,
  TASK_ARCHIVE_PIPELINE_ITEM,
  TASK_UNARCHIVE_PIPELINE_ITEM,
  TASK_DELETE_PIPELINE_ITEM,
  TASK_GET_PIPELINE_COMPANY_CONTACTS,
} from '../apps/my-pipeline/client/state'
import * as pipelineTasks from '../apps/my-pipeline/client/tasks'
import { TASK_GET_PIPELINE_LIST } from './components/Pipeline/state'
import * as pipelineListTasks from './components/Pipeline/tasks'
import { TASK_UPDATE_STAGE } from '../apps/investments/views/admin/client/state'
import * as investmentAdminTasks from '../apps/investments/views/admin/client/tasks'
import { TASK_POSTCODE_TO_REGION } from '../apps/companies/apps/add-company/client/state'
import {
  TASK_GET_ACTIVE_EVENTS,
  TASK_SAVE_INTERACTION,
  TASK_OPEN_CONTACT_FORM,
} from '../apps/interactions/apps/details-form/client/state'
import * as addInteractionFormTasks from '../apps/interactions/apps/details-form/client/tasks'

import { TASK_UPDATE_ADVISER } from '../apps/companies/apps/advisers/client/state'
import * as manageAdviser from '../apps/companies/apps/advisers/client/tasks'

import { DNB__CHECK_PENDING_REQUEST } from '../apps/companies/apps/business-details/client/state'
import * as dnbCheck from '../apps/companies/apps/business-details/client/tasks'

import { TASK_GET_PROFILES_LIST } from '../apps/investments/client/profiles/state'
import * as investmentProfilesTasks from '../apps/investments/client/profiles/tasks'

import { TASK_GET_OPPORTUNITY_DETAILS } from '../apps/investments/client/opportunities/state'
import * as investmentOpportunitiesTasks from '../apps/investments/client/opportunities/tasks'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
} from '../apps/investments/client/projects/state'
import * as getInvestmentProjects from '../apps/investments/client/projects/tasks'

import * as myInvestmentProjects from './components/MyInvestmentProjects/tasks'
import { TASK_GET_MY_INVESTMENTS_LIST } from './components/MyInvestmentProjects/state'

import { fetchInvestmentSummaryDataRanges } from './components/InvestmentProjectSummary/tasks'
import { TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES } from './components/InvestmentProjectSummary/state'

import { fetchOutstandingPropositions } from './components/InvestmentReminders/tasks'
import { TASK_GET_OUTSTANDING_PROPOSITIONS } from './components/InvestmentReminders/state'

import Footer from '../client/components/Footer'

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

const appWrapper = document.getElementById('react-app')
const globalProps = parseProps(appWrapper)

if (globalProps.sentryDsn) {
  Sentry.init({
    dsn: globalProps.sentryDsn,
    environment: globalProps.sentryEnvironment,
  })
}

function App() {
  return (
    <Provider
      tasks={{
        'Company lists': companyListsTasks.fetchCompanyLists,
        'Company list': companyListsTasks.fetchCompanyList,
        'Exports history': exportsHistoryTasks.fetchExportsHistory,
        'Referral details': referralTasks.fetchReferralDetails,
        Referrals: referralListTask,
        'Export wins': exportWinsTasks.fetchExportWins,
        [TASK_OPEN_REFERRALS_CONTACT_FORM]: referralsSendTasks.openContactForm,
        [TASK_SAVE_REFERRAL]: referralsSendTasks.saveReferral,
        [TASK_SAVE_ONE_LIST_DETAILS]: editOneListTasks.saveOneListDetails,
        [EXPORT_COUNTRIES_EDIT_NAME]:
          exportCountriesEditTasks.saveExportCountries,
        [TASK_GET_PIPELINE_BY_COMPANY]: pipelineTasks.getPipelineByCompany,
        [TASK_ADD_COMPANY_TO_PIPELINE]: pipelineTasks.addCompanyToPipeline,
        [TASK_GET_PIPELINE_LIST]: pipelineListTasks.getPipelineList,
        [TASK_GET_PIPELINE_ITEM]: pipelineTasks.getPipelineItem,
        [TASK_EDIT_PIPELINE_ITEM]: pipelineTasks.editPipelineItem,
        [TASK_ARCHIVE_PIPELINE_ITEM]: pipelineTasks.archivePipelineItem,
        [TASK_UNARCHIVE_PIPELINE_ITEM]: pipelineTasks.unarchivePipelineItem,
        [TASK_DELETE_PIPELINE_ITEM]: pipelineTasks.deletePipelineItem,
        [TASK_GET_PIPELINE_COMPANY_CONTACTS]: pipelineTasks.getCompanyContacts,
        [TASK_POSTCODE_TO_REGION]: addCompanyPostcodeToRegionTask,
        [TASK_GET_ACTIVE_EVENTS]: addInteractionFormTasks.fetchActiveEvents,
        [TASK_SAVE_INTERACTION]: addInteractionFormTasks.saveInteraction,
        [TASK_OPEN_CONTACT_FORM]: addInteractionFormTasks.openContactForm,
        [TASK_UPDATE_STAGE]: investmentAdminTasks.updateProjectStage,
        [TASK_UPDATE_ADVISER]: manageAdviser.updateAdviser,
        [TASK_GET_OPPORTUNITY_DETAILS]:
          investmentOpportunitiesTasks.getOpportunityDetail,
        [DNB__CHECK_PENDING_REQUEST]: dnbCheck.checkIfPendingRequest,
        [TASK_GET_PROFILES_LIST]:
          investmentProfilesTasks.getLargeCapitalProfiles,
        [TASK_GET_PROJECTS_LIST]: getInvestmentProjects.getProjects,
        [TASK_GET_ADVISER_NAME]: getInvestmentProjects.getAdviserNames,
        [TASK_GET_INVESTMENTS_PROJECTS_METADATA]:
          getInvestmentProjects.getMetadata,
        [TASK_GET_MY_INVESTMENTS_LIST]:
          myInvestmentProjects.fetchMyInvestmentsList,
        [TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES]: fetchInvestmentSummaryDataRanges,
        [TASK_GET_OUTSTANDING_PROPOSITIONS]: fetchOutstandingPropositions,
        'Large investment profiles filters':
          investmentProfilesTasks.loadFilterOptions,
      }}
    >
      <Mount selector="#add-company-form">
        {(props) => (
          <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#interaction-details-form">
        {(props) => (
          <InteractionDetailsForm
            csrfToken={globalProps.csrfToken}
            {...props}
          />
        )}
      </Mount>
      <Mount selector="#edit-company-form">
        {(props) => (
          <EditCompanyForm csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#company-edit-history">
        {(props) => (
          <CompanyEditHistory csrfToken={globalProps.csrfToken} {...props} />
        )}
      </Mount>
      <Mount selector="#investment-edit-history">
        {(props) => (
          <InvestmentEditHistory csrfToken={globalProps.csrfToken} {...props} />
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
      <Mount selector="#dashboard">
        {(props) => (
          <PersonalisedDashboard
            csrfToken={globalProps.csrfToken}
            id="dashboard"
            {...props}
          />
        )}
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
      <Mount selector="#company-edit-one-list">
        {(props) => (
          <EditOneListForm {...props} csrfToken={globalProps.csrfToken} />
        )}
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
      <Mount selector="#company-export-exports-edit">
        {(props) => <ExportsEdit {...props} />}
      </Mount>
      <Mount selector="#interaction-referral-details">
        {(props) => <InteractionReferralDetails {...props} />}
      </Mount>
      <Mount selector="#company-export-countries-edit">
        {(props) => <ExportCountriesEdit {...props} />}
      </Mount>
      <Mount selector="#pipeline-form">
        {(props) => <PipelineForm {...props} />}
      </Mount>
      <Mount selector="#company-local-header">
        {(props) => <CompanyLocalHeader {...props} />}
      </Mount>
      <Mount selector="#investment-project-admin">
        {(props) => <InvestmentProjectAdmin {...props} />}
      </Mount>
      <Mount selector="#flash-messages">
        {(props) => <FlashMessages {...props} />}
      </Mount>
      <Mount selector="#archive-pipeline-item-form">
        {(props) => <ArchivePipelineItemForm {...props} />}
      </Mount>
      <Mount selector="#unarchive-pipeline-item-form">
        {(props) => <UnarchivePipelineItemForm {...props} />}
      </Mount>
      <Mount selector="#delete-pipeline-item-form">
        {(props) => <DeletePipelineItemForm {...props} />}
      </Mount>
      <Mount selector="#footer">{() => <Footer />}</Mount>
      <Mount selector="#investment-projects-collection">
        {(props) => <InvestmentProjectsCollection {...props} />}
      </Mount>
      <Mount selector="#ie-banner">{() => <IEBanner />}</Mount>
      <Mount selector="#opportunities">
        {(props) => <Opportunities {...props} />}
      </Mount>
    </Provider>
  )
}

ReactDOM.render(<App />, appWrapper)
