import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { GREEN } from 'govuk-colours'

import {
  TASK_FORM__DISMISS,
  TASK_FORM__SUCCESS,
  VALIDATED_FORM__BACK,
} from '../../../actions'
import ValidatedForm from '../../ValidatedForm'
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
  onSuccessDispatch = TASK_FORM__SUCCESS,
  valuesToPayload = (x) => x,
  resultToSuccessMessage: ResultToSuccessMessage = () =>
    'Form was submitted successfully',
  // This is here to keep the form in the progress state when it succeeded in case
  // we do a hard redirect, so the form is still in progress untill the next page loads
  keepProgressOnSuccess,
  onSuccessRender: OnSuccessRender,
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
  useEffect(() => () => dispatch({ type: TASK_FORM__DISMISS }), [])

  return (
    <Task>
      {(getTask) => {
        const task = getTask(name, id)
        return OnSuccessRender && success ? (
          <OnSuccessRender result={result} />
        ) : (
          <StyledRoot>
            {showSuccessBox && !task.status && (
              <DismissableStatusMessage
                colour={GREEN}
                ref={successBoxRef}
                tabIndex={0}
                role="alert"
                onDismiss={() => dispatch({ type: TASK_FORM__DISMISS })}
              >
                <ResultToSuccessMessage result={result} />
              </DismissableStatusMessage>
            )}
            <TaskLoadingBox
              name={name}
              id={id}
              alsoRenderOverlayIf={keepProgressOnSuccess && success}
            >
              <ValidatedForm
                {...props}
                id={id}
                onSubmit={task.dismissError}
                onSubmit={(e, values) => {
                  e.preventDefault()
                  task.start({
                    payload: valuesToPayload(values),
                    onSuccessDispatch: onSuccessDispatch,
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

/**
 * @function TaskForm
 * @description Extends the {ValidatedForm} so that {onValidatedSubmit} starts
 * a {Task} defined by {props.name} and {props.id} with the payload being an
 * object of field names mapped to their values. The form will be overlayed
 * with a progress indicator during the task's progress and if the task rejects
 * it renders the {Task.Status} error state on top of the overlay.
 * If the task resolves, a customisable, dismissable success message will be
 * rendered on the top of the form.
 * @param {Object} props - Apart from props mentioned here, it also accepts all
 * the {ValidatedForm} except for {onSubmit} and {onSubmit}.
 * @param {string} props.name - The name of the task to be started on submit
 * @param {string} props.id - The ID of the task to be started on submit.
 * Note that this same {id} will be used as the ID for the underlying
 * {ValidatedForm}.
 * @param {(values: Record<string, unknown>) => unknown} [props.valuesToPayload=identity]
 * - A function which can be used to transform the submitted field values to the
 * task payload or to mix in additional data to it.
 * @param {(props: {result: unknown}) => React.ReactNode} [resultToSuccessMessage]
 * - Use this to customize the content of the success message.
 * @param {string} [props.onSuccessDispatch] - Passed to the underlaying {Task}
 * {start} method. If set, the success message won't be rendered, neither will
 * the {onSuccessRender} be taken into account.
 * @param {(props: {result: unknown}) => React.ReactNode} [onSuccessRender] -
 * If set the component passed to it will be rendered instead of the form when
 * the task resolves.
 * @param {any} [keepProgressOnSuccess] - If truthy, the progress indicator
 * overlay will stay rendered even after the task resolves. Use this in
 * conjunction with the {HardRedirect} component used in {onSuccessRender}
 * to keep the form in the progress state while the browser is loading the
 * next page.
 */
export default multiInstance({
  actionPattern: [TASK_FORM__DISMISS, TASK_FORM__SUCCESS, VALIDATED_FORM__BACK],
  name: 'Task/Form',
  reducer: (state, { type, result }) => {
    switch (type) {
      case TASK_FORM__DISMISS:
      case VALIDATED_FORM__BACK:
        return {
          ...state,
          showSuccessBox: false,
        }
      case TASK_FORM__SUCCESS:
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
