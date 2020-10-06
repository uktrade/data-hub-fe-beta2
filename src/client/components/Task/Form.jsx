import React, { useEffect } from 'react'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'

import ValidatedForm from '../Form/Validated'
import Task from '.'
import Err from './Error'
import multiInstance from '../../utils/multiinstance'

const StyledRoot = styled.div({
  position: 'relative',
})

const StyledError = styled(Err)({
  position: 'absolute',
  background: 'white',
  zIndex: 101,
  pointerEvents: 'all',
})

const StyledErrorWrapper = styled.div({
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
})

const TaskForm = ({
  name,
  id,
  onSuccessDispatch,
  taskErrorToErrors,
  children,
  valuesToPayload = (x) => x,
  onSuccess,
  successAction,
  ...props
}) => {
  useEffect(() => {
    successAction && onSuccess(successAction.result, successAction)
  })
  return (
    <Task>
      {(getTask) => {
        const task = getTask(name, id)
        const showError = task.error && !taskErrorToErrors
        const taskErrors = taskErrorToErrors && taskErrorToErrors(task.error)

        const interceptedChildren = (field, errors, ...args) => {
          return children(
            (name) => ({
              error: taskErrors[name],
              ...field(name),
            }),
            taskErrors,
            ...args
          )
        }

        return (
          <StyledRoot>
            <LoadingBox loading={task.progress || showError}>
              <ValidatedForm
                {...props}
                id={`Task/From.${id}`}
                defaultErrors={taskErrors}
                children={
                  task.error && taskErrorToErrors
                    ? interceptedChildren
                    : children
                }
                onSubmit={task.dismissError}
                onValidSubmit={(e, values) => {
                  e.preventDefault()
                  task.start({
                    payload: valuesToPayload(values),
                    onSuccessDispatch: onSuccessDispatch || 'TASK_FORM__SUCESS',
                  })
                }}
              />
              {showError && (
                <StyledErrorWrapper>
                  <StyledError
                    {...task}
                    name={name}
                    headline="Couldn't submit form"
                  />
                </StyledErrorWrapper>
              )}
            </LoadingBox>
          </StyledRoot>
        )
      }}
    </Task>
  )
}

export default multiInstance({
  actionPattern: 'TASK_FORM__',
  name: 'Task/Form',
  reducer: (state, action) => ({ successAction: action }),
  component: TaskForm,
})
