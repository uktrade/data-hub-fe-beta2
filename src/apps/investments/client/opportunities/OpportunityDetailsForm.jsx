import React from 'react'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS_METADATA, ID, state2props } from './state'
import {
  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
  INVESTMENT_OPPORTUNITY__CANCEL_EDIT,
} from '../../../../client/actions'

import InputField from '@govuk-react/input-field'
import TextArea from '@govuk-react/text-area'
import Link from '@govuk-react/link'
import Button from '@govuk-react/button'

import Task from '../../../../client/components/Task'
import {
  FieldWrapper,
  FormActions,
  Typeahead,
} from '../../../../client/components'

const OpportunityDetailForm = ({
  details,
  metadata,
  onDetailsChange,
  onCancel,
}) => {
  const {
    name,
    description,
    ukRegions,
    // TODO: add the other fields
  } = details.detailsFields

  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_DETAILS_METADATA}
      id={ID}
      startOnRender={{
        onSuccessDispatch: INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
      }}
    >
      {() => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: link to a Task for patching data
          }}
        >
          <InputField
            input={{
              defaultValue: name,
              onChange: (e) => {
                onDetailsChange({ name: e.target.value })
              },
              name: 'name',
              id: 'field-name',
            }}
          >
            Opportunity name
          </InputField>

          <TextArea
            input={{
              defaultValue: description,
              onChange: (e) => {
                onDetailsChange({ description: e.target.value })
              },
              name: 'description',
              id: 'field-description',
            }}
          >
            Opportunity description
          </TextArea>

          <FieldWrapper label="UK location" name="ukRegions">
            <Typeahead
              name="ukRegions"
              placeholder="-- Select a UK region --"
              options={metadata.ukRegions}
              isMulti={true}
              defaultValue={ukRegions}
              onChange={(e) => {
                onDetailsChange({ ukRegions: e })
              }}
            />
          </FieldWrapper>

          <FormActions>
            <Button>Save</Button>
            <Link onClick={onCancel}>Cancel</Link>
          </FormActions>
        </form>
      )}
    </Task.Status>
  )
}

export default connect(state2props, (dispatch) => ({
  onDetailsChange: (formData) => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
      result: formData,
    })
  },
  onCancel: () => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__CANCEL_EDIT,
    })
  },
}))(OpportunityDetailForm)
