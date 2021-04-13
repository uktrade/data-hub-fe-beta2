import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import styled from 'styled-components'

import Task from '.'

const StyledContentWrapper = styled.div({
  position: 'relative',
})

const StyledErrorOverlay = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.85)',
})

/**
 * @function TaskLoadingBox
 * @description A loading box tied to the status of a _task_ instance.
 * The box will overlay it's contents with a spinner when the task is in
 * progress or error, in which case it will also render the error message on top
 * of the overlay.
 * @param {Object} props
 * @param {string} props.name - The _task_ name
 * @param {string} props.id - The _task_ id
 * @param {any} [props.renderErrorUnless] - If truthy the error state won't be
 * rendered
 * @param {any} [props.alsoRenderOverlayIf] - If truthy, the overlay will also
 * be rendered on states other than _loading_.
 * @example
 * <TaskLoadingBox
 *    name="dummy-task"
 *    id="foo"
 *    alsoRenderOverlayIf={taskSucceeded}
 *    renderErrorUnless={dontShowErrorForSomeReason}
 * >
 *   contents
 * </TaskLoadingBox>
 */
export default ({
  name,
  id,
  alsoRenderOverlayIf,
  renderErrorUnless,
  children,
  ...props
}) => (
  <Task>
    {(t) => {
      const task = t(name, id)
      return (
        <LoadingBox loading={task.progress || alsoRenderOverlayIf}>
          <StyledContentWrapper>
            {!renderErrorUnless && task.error ? (
              <>
                {children}
                <StyledErrorOverlay>
                  <Task.Status {...props} name={name} id={id} />
                </StyledErrorOverlay>
              </>
            ) : (
              children
            )}
          </StyledContentWrapper>
        </LoadingBox>
      )
    }}
  </Task>
)
