import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Link } from 'govuk-react'
import { ERROR_COLOUR } from 'govuk-colours'
import styled from 'styled-components'
import { FormActions, FormStateful, StatusMessage } from 'data-hub-components'

import FieldRegionTypeahead from '../FieldRegionTypeahead'
import Task from '../../../../../../client/components/Task/index.jsx'
import { EXPORT_COUNTRIES_EDIT__SAVE } from '../../../../../../client/actions'
import {
  state2props,
  ID as TASK_ID,
  TASK_NAME,
  API_ERROR,
  API_WARN,
  SAVED,
} from './state'
import urls from '../../../../../../lib/urls'

const StyledH2 = styled.h2`
  font-weight: bold;
`
const StyledP = styled.p`
  margin: 0;
`

function ErrorHandler({ errorMessage }) {
  return (
    <>
      {errorMessage[API_ERROR] && (
        <StatusMessage
          colour={ERROR_COLOUR}
          aria-labelledby="api-error-summary-title"
          role="alert"
        >
          <StyledH2 id="api-error-summary-title">
            {errorMessage[API_ERROR]}
          </StyledH2>
        </StatusMessage>
      )}

      {errorMessage[API_WARN] && (
        <StatusMessage aria-labelledby="error-summary-title" role="alert">
          <StyledH2 id="error-summary-title">
            Export countries could not be saved, try again later.
          </StyledH2>
          <StyledP>{errorMessage[API_WARN]}</StyledP>
        </StatusMessage>
      )}
    </>
  )
}

function ExportCountriesEdit(state) {
  const { companyId, countries, fields } = state

  useEffect(() => {
    if (state[SAVED]) {
      window.location.href = state[SAVED]
    }
  })

  return (
    <Task>
      {(getTask) => (
        <FormStateful
          onSubmit={(values) => {
            getTask(TASK_NAME, TASK_ID).start({
              payload: { values, companyId },
              onSuccessDispatch: EXPORT_COUNTRIES_EDIT__SAVE,
            })
            return null
          }}
          initialValues={fields
            .filter(({ values }) => !!values?.length)
            .reduce((acc, { name, values }) => {
              acc[name] = values
              return acc
            }, {})}
        >
          <Task.Status
            name={TASK_NAME}
            id={TASK_ID}
            renderProgress={() => null}
            renderError={ErrorHandler}
          />

          {fields.map(({ label, name }) => (
            <FieldRegionTypeahead
              key={name}
              isMulti={true}
              label={label}
              name={name}
              countries={countries}
              placeholder="Search for region or country..."
            />
          ))}
          <FormActions>
            <Button>Save and return</Button>
            <Link href={urls.companies.exports.index(companyId)}>
              Return without saving
            </Link>
          </FormActions>
        </FormStateful>
      )}
    </Task>
  )
}

export default connect(state2props)(ExportCountriesEdit)
