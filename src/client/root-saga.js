import { fork } from 'redux-saga/effects'

import tasksSaga from './components/Task/saga'
import analyticsSaga from './components/Analytics/saga'

import * as companyListsTasks from './components/CompanyLists/tasks'
import * as referralTasks from '../apps/companies/apps/referrals/details/client/tasks'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/client/ExportsHistory/tasks'
import referralListTask from './components/ReferralList/task'
import {
  TASK_OPEN_REFERRALS_CONTACT_FORM,
  TASK_SAVE_REFERRAL,
} from '../apps/companies/apps/referrals/send-referral/client/state'
import * as referralsSendTasks from '../apps/companies/apps/referrals/send-referral/client/tasks'
import * as exportWinsTasks from '../apps/companies/apps/exports/client/ExportWins/tasks'
import { TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME } from '../apps/companies/apps/exports/client/ExportCountriesEdit/state'
import * as exportCountriesEditTasks from '../apps/companies/apps/exports/client/ExportCountriesEdit/tasks'
import * as addCompanyTasks from '../apps/companies/apps/add-company/client/tasks'
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

export default function* rootSaga() {
  yield fork(
    tasksSaga({
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
      [TASK_POSTCODE_TO_REGION]: addCompanyTasks.postcodeToRegion,
      [TASK_GET_ACTIVE_EVENTS]: addInteractionFormTasks.fetchActiveEvents,
      [TASK_SAVE_INTERACTION]: addInteractionFormTasks.saveInteraction,
      [TASK_OPEN_CONTACT_FORM]: addInteractionFormTasks.openContactForm,
      [TASK_UPDATE_STAGE]: investmentAdminTasks.updateProjectStage,
    })
  )
  yield fork(analyticsSaga)
}
