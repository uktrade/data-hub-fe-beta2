import React from 'react'
import Provider from './provider'

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

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
} from '../apps/investments/client/projects/state'
import * as getInvestmentProjects from '../apps/investments/client/projects/tasks'

export default ({ element }) => {
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
        [DNB__CHECK_PENDING_REQUEST]: dnbCheck.checkIfPendingRequest,
        [TASK_GET_PROFILES_LIST]:
          investmentProfilesTasks.getLargeCapitalProfiles,
        [TASK_GET_PROJECTS_LIST]: getInvestmentProjects.getProjects,
        [TASK_GET_ADVISER_NAME]: getInvestmentProjects.getAdviserNames,
        [TASK_GET_INVESTMENTS_PROJECTS_METADATA]:
          getInvestmentProjects.getMetadata,
      }}
    >
      {element}
    </Provider>
  )
}
