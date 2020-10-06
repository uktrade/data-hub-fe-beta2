import React from 'react'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'

import ValidatedForm from '../Form/Validated'
import Task from '.'
import Err from './Error'

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
  ...props
}) => (
  <Task>
    {(getTask) => {
      const task = getTask(name, id)
      const showError = task.error && !taskErrorToErrors
      const taskErrors = taskErrorToErrors && taskErrorToErrors(task.error)

      const interceptedChildren = (field, errors, ...args) => {
        return children(
          (name, ...args) => ({
            error: taskErrors[name],
            ...field(name, ...args),
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
                task.error && taskErrorToErrors ? interceptedChildren : children
              }
              onSubmit={task.dismissError}
              onValidSubmit={(e, values) => {
                e.preventDefault()
                task.start({
                  payload: valuesToPayload(values),
                  onSuccessDispatch,
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

export default TaskForm
