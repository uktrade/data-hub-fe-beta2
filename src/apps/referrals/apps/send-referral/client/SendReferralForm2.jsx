import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get, throttle } from 'lodash'

import {
  FieldInput,
  FieldTextarea,
  FieldTypeahead,
  FormActions,
  Form,
  Step,
  SummaryTable,
} from 'data-hub-components'
import { Button, H4, Link } from 'govuk-react'

import {
  FORM_FIELD_CHANGE,
  FORM_FIELD_SET_VALUE,
  FORM_FIELD_TOUCHED,
  FORM_FIELD_BLUR,
  FORM_FIELD_FOCUS,
  FORM_FIELD_REGISTER,
  FORM_FIELD_DEREGISTER,
  FORM_FIELD_ERROR,
  FORM_VALIDATE,
  FORM_FORWARD,
  FORM_BACK,
  FORM_SUBMIT,
  FORM_STEP_REGISTER,
  FORM_STEP_DEREGISTER,
} from '../../../../../client/actions'
import SecondaryButton from '../../../../../client/components/SecondaryButton'
import styled from 'styled-components'
import axios from 'axios'
import ValidatedInput from '../../../../../client/components/ValidatedInput'

const StyledParagraph = styled('p')`
  font-size: 16px;
`

const SendReferralForm2 = ({
  companyName,
  companyId,
  csrfToken,
  companyContacts,
  cancelUrl,
  onContinue,
  onError,
  subject,
  notes,
  contact,
  adviser,
  subjectError,
  emptyFields = [],
  onSubjectChange,
  onAdviserChange,
  onContactChange,
  ...props
}) => {
  return (
    <Form {...props}>
      <Step name="referral_details" backButton={null} forwardButton={null}>
        <H4>Who do you want to send this referral to?</H4>

        <FieldTypeahead
          label="Adviser"
          name="adviser"
          required="Select an adviser for the referral"
          placeholder="Search for an adviser"
          hint={
            <>
              This can be a person in Post, a sector team or an ITA. If you are
              not sure who this might be, you can{' '}
              <a href="https://people.trade.gov.uk/teams/department-for-international-trade">
                find the relevant teams and people on Digital Workspace
              </a>
              .
            </>
          }
          loadOptions={throttle(
            (searchString) =>
              axios
                .get('/api-proxy/adviser/', {
                  params: {
                    autocomplete: searchString,
                    permission__has: 'company_referral.change_companyreferral',
                  },
                })
                .then(({ data: { results } }) =>
                  results
                    .filter((adviser) => adviser?.name.trim().length)
                    .map(({ id, name, dit_team }) => ({
                      label: `${name}${dit_team ? ', ' + dit_team.name : ''}`,
                      value: id,
                    }))
                ),
            500
          )}
        />

        <H4>What is this referral or introduction about?</H4>
        <FieldInput
          type="text"
          label="Subject"
          name="subject"
          required="Enter a subject for the referral"
          validate={(value) =>
            value.length &&
            value.length > 255 &&
            'Subject must be 255 characters or less'
          }
        />

        <FieldTextarea
          label="Notes (optional)"
          hint="For example the details of previous conversations with the company, or a description of the purpose or opportunity this referral is about"
          name="notes"
        />

        <FieldTypeahead
          label="Company contact (optional)"
          name="contact"
          hint="Should the person you're referring the company to get in contact with anyone in particular"
          placeholder="Select a contact"
          options={companyContacts.map((contact) => ({
            label: contact.name,
            value: contact.id,
          }))}
          isMulti={false}
          isClearable={true}
        />

        <FormActions>
          <Button>Continue</Button>
          <Link href={cancelUrl}>Cancel</Link>
        </FormActions>
      </Step>

      <Step name="confirmation" backButton={null} forwardButton={null}>
        {() => (
          <>
            <SummaryTable caption="Check referral details">
              <SummaryTable.Row heading="Send this company record to">
                {props.values.adviser?.label}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Subject">{subject}</SummaryTable.Row>
              <SummaryTable.Row heading="Notes">
                {props.values.notes || 'No notes added'}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Company contact">
                {props.values.contact?.label || 'No contact added'}
              </SummaryTable.Row>
            </SummaryTable>
            <SecondaryButton onClick={props.goBack}>
              Edit referral
            </SecondaryButton>
            <H4>What happens next</H4>
            <StyledParagraph>
              <p>
                <p>
                  Clicking “Send referral” will show the referral in the
                  activity of {companyName}, as well as in the Referrals section
                  on both your Data Hub Homepage and the Homepage of the
                  recipient.
                </p>
                <p>It might take up to 24 hours for the referral to appear.</p>
                <p>
                  You will not be able to edit the referral after this point.
                </p>
              </p>
            </StyledParagraph>

            <FormActions>
              <Button>Send referral</Button>
              <Link href={cancelUrl}>Cancel</Link>
            </FormActions>
          </>
        )}
      </Step>

      <pre>
        <code>{JSON.stringify(props, 0, 2)}</code>
      </pre>
    </Form>
  )
}

SendReferralForm2.propTypes = {
  companyContacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  cancelUrl: PropTypes.string.isRequired,
}

export default connect(
  (state) => ({
    ...state.sendReferral2,
    getStepIndex: (stepName) => {
      const index = state.sendReferral2.steps.indexOf(stepName)
      return index !== -1 ? index : null
    },
    isFirstStep: () => state.sendReferral2.currentStep === 0,
    isLastStep: () =>
      state.sendReferral2.currentStep ===
        state.sendReferral2.steps.length - 1 ||
      state.sendReferral2.steps.length === 0,
    getFieldState: (fieldName) => {
      const fieldState = {
        value: get(state, `sendReferral2.values[${fieldName}]`, ''),
        touched: get(state, `sendReferral2.touched[${fieldName}]`, false),
        error: get(state, `sendReferral2.errors[${fieldName}]`, undefined),
      }
      return fieldState
    },
  }),
  (dispatch) => ({
    registerField: (field) => {
      dispatch({
        type: FORM_FIELD_REGISTER,
        field,
      })
    },
    deregisterField: (fieldName) => {
      dispatch({
        type: FORM_FIELD_DEREGISTER,
        fieldName,
      })
    },
    setFieldValue: (fieldName, fieldValue) => {
      dispatch({
        type: FORM_FIELD_SET_VALUE,
        fieldName,
        fieldValue,
      })
    },
    setFieldTouched: (fieldName) => {
      dispatch({
        type: FORM_FIELD_TOUCHED,
        fieldName,
      })
    },
    goForward: () => {
      dispatch({
        type: FORM_FORWARD,
      })
    },
    goBack: () => {
      dispatch({
        type: FORM_BACK,
      })
    },
    registerStep: (stepName) => {
      dispatch({
        type: FORM_STEP_REGISTER,
        stepName,
      })
    },
    deregisterStep: (stepName) => {
      dispatch({
        type: FORM_STEP_DEREGISTER,
        stepName,
      })
    },
  })
)(SendReferralForm2)
