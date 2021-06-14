import _ from 'lodash'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LoadingBox } from 'govuk-react'
import { connect } from 'react-redux'

import { MultiInstanceForm } from '../../../../../client/components'
import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'
import Analytics from '../../../../../client/components/Analytics'
import Task from '../../../../../client/components/Task'
import {
  ADD_INTERACTION_FORM__CONTACT_FORM_OPENED,
  ADD_INTERACTION_FORM__SUBMIT,
} from '../../../../../client/actions'
import {
  ID as STATE_ID,
  TASK_SAVE_INTERACTION,
  TASK_OPEN_CONTACT_FORM,
} from './state'
import urls from '../../../../../lib/urls'
import {
  addMessage,
  addMessageWithBody,
} from '../../../../../client/utils/flash-messages'

const getReturnLink = (
  companyId,
  referralId,
  investmentId,
  contactId,
  interactionId
) => {
  if (referralId) {
    return urls.companies.referrals.interactions.detail(
      companyId,
      referralId,
      interactionId
    )
  } else if (investmentId) {
    return urls.investments.projects.interactions.detail(
      investmentId,
      interactionId
    )
  } else if (contactId) {
    return urls.contacts.interactions.detail(contactId, interactionId)
  }

  return urls.companies.interactions.detail(companyId, interactionId)
}

const InteractionDetailsForm = ({
  companyId,
  referralId,
  investmentId,
  contactId,
  returnLink,
  updatedInteractionId,
  wasPolicyFeedbackProvided,
  initialValues,
  progress = false,
  has_related_trade_agreements,
  related_trade_agreements,
  ...props
}) => {
  useEffect(() => {
    if (updatedInteractionId) {
      if (!initialValues.id) {
        if (wasPolicyFeedbackProvided) {
          const body = [
            'Thanks for submitting business intelligence (BI), which feeds into the Business Intelligence Unit’s reports. If they need more information, they will contact you.',
            '',
            'For more on the value of BI, <a href="https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/business-intelligence-reports/" target="_blank">See the Digital Workspace article</a> (opens in new tab)',
          ].join('<br />')
          addMessageWithBody('success', 'Interaction created', body)
        } else {
          addMessage('success', 'Interaction created')
        }
      }
      window.location.href = getReturnLink(
        companyId,
        referralId,
        investmentId,
        contactId,
        updatedInteractionId
      )
    }
  }, [updatedInteractionId, returnLink])
  return (
    <Task>
      {(getTask) => {
        const saveInteractionTask = getTask(TASK_SAVE_INTERACTION, STATE_ID)
        const openContactFormTask = getTask(TASK_OPEN_CONTACT_FORM, STATE_ID)

        return (
          <Analytics>
            {(pushAnalytics) => (
              <MultiInstanceForm
                id={STATE_ID}
                initialValues={initialValues}
                submissionError={saveInteractionTask.errorMessage}
                onSubmit={(values) => {
                  saveInteractionTask.start({
                    payload: {
                      values,
                      companyId,
                      referralId,
                    },
                    onSuccessDispatch: ADD_INTERACTION_FORM__SUBMIT,
                  })
                  pushAnalytics({
                    event: 'create_interaction',
                    ..._.pick(
                      values,
                      'was_policy_feedback_provided',
                      'were_countries_discussed'
                    ),
                  })
                }}
              >
                {({ values, currentStep }) => (
                  <LoadingBox loading={progress}>
                    {(!initialValues.theme || !initialValues.kind) && (
                      <MultiInstanceForm.Step name="interaction_type">
                        {() => <StepInteractionType />}
                      </MultiInstanceForm.Step>
                    )}

                    <MultiInstanceForm.Step
                      name="interaction_details"
                      forwardButton={
                        initialValues.id
                          ? 'Save interaction'
                          : 'Add interaction'
                      }
                    >
                      {() => (
                        <StepInteractionDetails
                          companyId={companyId}
                          activeEvent={initialValues.event}
                          onOpenContactForm={(e) => {
                            e.preventDefault()
                            openContactFormTask.start({
                              payload: {
                                values,
                                currentStep,
                                companyId,
                                url: e.target.href,
                              },
                              onSuccessDispatch:
                                ADD_INTERACTION_FORM__CONTACT_FORM_OPENED,
                            })
                          }}
                          {...props}
                        />
                      )}
                    </MultiInstanceForm.Step>
                  </LoadingBox>
                )}
              </MultiInstanceForm>
            )}
          </Analytics>
        )
      }}
    </Task>
  )
}

InteractionDetailsForm.propTypes = {
  updatedInteractionId: PropTypes.string,
  wasPolicyFeedbackProvided: PropTypes.bool,
  companyId: PropTypes.string,
  referralId: PropTypes.string,
  investmentId: PropTypes.string,
  contactId: PropTypes.string,
  returnLink: PropTypes.string,
  progress: PropTypes.bool,
  initialValues: PropTypes.object,
  ...StepInteractionDetails.propTypes,
}

export default connect(
  ({ values, ...state }) => ({
    ...state[STATE_ID],
    values,
  }),
  (dispatch) => ({
    openContactForm: (page, event) => {
      event.target.blur()
      event.preventDefault()
      dispatch({
        type: ADD_INTERACTION_FORM__SUBMIT,
        page,
      })
    },
  })
)(InteractionDetailsForm)
