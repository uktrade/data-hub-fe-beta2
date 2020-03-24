import React from 'react'

import { MULTISTEP_FORM__BACK, MULTISTEP_FORM__NEXT } from '../../actions'
import ValidatedForm from '../ValidatedForm'
import multiInstance from '../../utils/multiinstance'

import reducer from './reducer'

const MultiStepForm = ({
  steps,
  step = 0,
  values: allValues = {},
  validators,
  onNextStep,
  onSubmit,
  onBack,
  id,
}) => {
  const currentStep = steps[step]
  const lastStep = step === steps.length - 1
  return (
    <ValidatedForm
      id={`MultiStepForm.${id}`}
      validators={validators}
      submitLabel={lastStep ? 'Submit' : 'Next'}
      secondaryActions={step ? [{ children: 'Back', onClick: onBack }] : []}
      onSubmit={(e, values) => {
        if (lastStep) {
          onSubmit(e, { ...allValues, ...values })
        } else {
          e.preventDefault()
          onNextStep(values)
        }
      }}
    >
      {({ errors, values, getField }) => {
        return (
          <>
            {typeof currentStep === 'function'
              ? currentStep({
                  step,
                  values: { ...allValues, ...values },
                  errors,
                  getField: (name) => ({
                    ...getField(name),
                    defaultValue: allValues[name],
                  }),
                })
              : currentStep}
            {/*
            We need to add all the values from the previous steps
            to the final form
            */}
            {lastStep &&
              Object.entries(allValues).map(([name, value]) => (
                <input type="hidden" name={name} value={value} />
              ))}
          </>
        )
      }}
    </ValidatedForm>
  )
}

export default multiInstance({
  name: 'MultiStepForm',
  reducer,
  component: MultiStepForm,
  dispatchToProps: (dispatch) => ({
    onNextStep: (values) =>
      dispatch({
        type: MULTISTEP_FORM__NEXT,
        values,
      }),
    onBack: () => dispatch({ type: MULTISTEP_FORM__BACK }),
  }),
})
