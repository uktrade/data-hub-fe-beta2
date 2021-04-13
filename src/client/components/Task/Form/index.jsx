import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { GREEN } from 'govuk-colours'

import MultiStepForm from '../../NewForm/MultiStep'
import Task from '..'
import multiInstance from '../../../utils/multiinstance'
import TaskLoadingBox from '../LoadingBox'
import DismissableStatusMessage from '../../StatusMessage/Dismissable'

const StyledRoot = styled.div({
  position: 'relative',
})

const TaskForm = ({
  name,
  id,
  onSuccessDispatch,
  valuesToPayload = (x) => x,
  resultToSuccessMessage: ResultToSuccessMessage = () =>
    'Form was submitted successfully',
  // This is here to keep the form in the progress state when it succeeded in case
  // we do a hard redirect, so the form is still in progress untill the next page loads
  keepProgressOnSuccess,
  onSuccessRender,
  // State props
  success,
  result,
  showSuccessBox,
  dispatch,
  ...props
}) => {
  const successBoxRef = useRef()

  useEffect(() => {
    requestAnimationFrame(() => {
      successBoxRef.current?.focus()
    })
  }, [showSuccessBox])

  // Dismiss the success message when the component unmounts
  useEffect(() => () => dispatch({ type: 'TASK_FORM__DISMISS' }), [])

  return (
    <Task>
      {(getTask) => {
        const task = getTask(name, id)
        return onSuccessRender && success ? (
          onSuccessRender
        ) : (
          <StyledRoot>
            {showSuccessBox && !task.status && (
              <DismissableStatusMessage
                colour={GREEN}
                ref={successBoxRef}
                tabIndex={0}
                role="alert"
                onDismiss={() => dispatch({ type: 'TASK_FORM__DISMISS' })}
              >
                <ResultToSuccessMessage result={result} />
              </DismissableStatusMessage>
            )}
            <TaskLoadingBox
              name={name}
              id={id}
              alsoRenderOverlayIf={keepProgressOnSuccess && success}
            >
              <MultiStepForm
                {...props}
                id={id}
                onSubmit={task.dismissError}
                onValidSubmit={(e, values) => {
                  e.preventDefault()
                  task.start({
                    payload: valuesToPayload(values),
                    onSuccessDispatch: onSuccessDispatch || 'TASK_FORM__SUCESS',
                  })
                }}
              />
            </TaskLoadingBox>
          </StyledRoot>
        )
      }}
    </Task>
  )
}

export default multiInstance({
  actionPattern: [
    // TODO: Move to ../actions.js
    'TASK_FORM__DISMISS',
    'TASK_FORM__SUCESS',
  ],
  name: 'Task/Form',
  reducer: (state, { type, result }) => {
    switch (type) {
      case 'TASK_FORM__DISMISS':
        return {
          ...state,
          showSuccessBox: false,
        }
      case 'TASK_FORM__SUCESS':
        return {
          success: true,
          result,
          showSuccessBox: true,
        }
      default:
        return state
    }
  },
  component: TaskForm,
})
