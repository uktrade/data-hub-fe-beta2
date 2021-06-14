import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import Task from '../../../client/components/Task'
import LoadingBox from '@govuk-react/loading-box'

import {
  PIPELINE__EDIT_ITEM,
  PIPELINE__GET_COMPANY_CONTACTS,
} from '../../../client/actions'

import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_COMPANY_CONTACTS,
  TASK_EDIT_PIPELINE_ITEM,
} from './state'

import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import GetPipelineData from './GetPipelineData'
import { PipelineItemPropType } from './constants'
import { getPipelineUrl } from './utils'
import { parse, isValid, format } from 'date-fns'

import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

function formatInitialValues(values) {
  const { sector, contacts } = values
  const expectedWinDate = parse(
    values.expected_win_date,
    'yyyy-MM-dd',
    new Date()
  )
  return {
    name: values.name,
    category: values.status,
    likelihood: String(values.likelihood_to_win),
    sector: sector ? { value: sector.id, label: sector.segment } : null,
    contacts: contacts?.map(({ id, name }) => ({ value: id, label: name })),
    export_value: values.potential_value,
    expected_win_date: isValid(expectedWinDate)
      ? {
          month: format(expectedWinDate, 'MM'),
          year: format(expectedWinDate, 'yyyy'),
        }
      : {
          month: '',
          year: '',
        },
  }
}

function GetCompanyContacts({ task, companyId, children }) {
  useEffect(() => {
    task.start({
      payload: { companyId },
      onSuccessDispatch: PIPELINE__GET_COMPANY_CONTACTS,
    })
  }, [companyId])

  return children
}

function EditPipelineItemForm({
  pipelineItemId,
  contacts,
  sectors,
  currentPipelineItem,
  savedPipelineItem,
}) {
  useEffect(() => {
    if (savedPipelineItem) {
      /**
       * TODO: Replace with react router navigation.
       * As we move to SPA clear the saveId from the state before navigation.
       */
      window.location.href = getPipelineUrl(savedPipelineItem)
    }
  }, [savedPipelineItem])

  return (
    <>
      <LocalHeader
        heading="Edit project"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.pipeline.index(), text: 'My Pipeline' },
          {
            text: 'Edit project',
          },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const editPipelineItem = getTask(TASK_EDIT_PIPELINE_ITEM, STATE_ID)

            const getCompanyContacts = getTask(
              TASK_GET_PIPELINE_COMPANY_CONTACTS,
              STATE_ID
            )
            return (
              <>
                <GetPipelineData
                  getTask={getTask}
                  pipelineItemId={pipelineItemId}
                  currentPipelineItem={currentPipelineItem}
                >
                  {() => (
                    <GetCompanyContacts
                      task={getCompanyContacts}
                      companyId={currentPipelineItem.company.id}
                    >
                      <LoadingBox
                        loading={
                          getCompanyContacts.progress ||
                          editPipelineItem.progress
                        }
                      >
                        <PipelineForm
                          submissionError={editPipelineItem.errorMessage}
                          onSubmit={(values) => {
                            editPipelineItem.start({
                              payload: {
                                values,
                                pipelineItemId,
                                currentPipelineItem,
                              },
                              onSuccessDispatch: PIPELINE__EDIT_ITEM,
                            })
                          }}
                          cancelLink={getPipelineUrl(currentPipelineItem)}
                          initialValue={
                            currentPipelineItem &&
                            formatInitialValues(currentPipelineItem)
                          }
                          sectors={sectors}
                          contacts={contacts}
                        />
                      </LoadingBox>
                    </GetCompanyContacts>
                  )}
                </GetPipelineData>
              </>
            )
          }}
        </Task>
      </Main>
    </>
  )
}

EditPipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default EditPipelineItemForm
