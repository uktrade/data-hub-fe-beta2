/**
 * If any changes are done to this file which changes the way we use it then
 * PLEASE update the docs - https://github.com/uktrade/data-hub-frontend/tree/master/docs/Redux%20and%20Saga.md
 **/

import React from 'react'
import { connect } from 'react-redux'

import { TASK__START, TASK__DISMISS_ERROR, TASK__CANCEL } from '../../actions'
import ProgressIndicator from '../ProgressIndicator'
import {GlobalState} from '../types'

import Err from './Error'
import StartOnRender, {OwnProps as StartOnRenderProps} from './StartOnRender'
import {TaskStartAction, TaskCancelAction, TaskDismissErrorAction, State, Status, TaskInstanceState} from './types'
export interface StartOptions {
  // TODO: Change to an exhaustive union type of task success action types
  onSuccessDispatch?: string
  // TODO: Make it a concrete union type
  payload?: any
}

export interface StateProps {
  state: State
}
export interface DispatchProps {
  start(name: string, id: string, startOptions: StartOptions): void
  cancel(name: string, id: string): void
  dismissError(name: string, id: string): void
}

export interface TaskInstance extends TaskInstanceState {
  progress: boolean
  error: boolean
  start(options: StartOptions): void
  cancel(): void
  retry(): void
  dismissError(): void
}

export type GetTask = (name: string, id: string) => TaskInstance

export interface OwnProps {
  children(getTask: GetTask): React.ReactNode
}

export interface Props extends OwnProps, DispatchProps, StateProps {}

/**
 * Enables starting and reading states of _registered tasks_. A _task_ is a
 * function which takes a _payload_ as its only argument and returns a
 * {Promise}. If the promise rejects with a value which is not an instance of
 * {Error}, it will be rendered as the error message in {Task.Status}. If it
 * rejects with an {Error} instance, the error will be rethrown.
 * _Tasks_ are registered by passing a map of names to _tasks_ to the
 * `tasksSagaFactory` function and plugging in the resulting saga e.g.
 * To register a task that always succeeds with the value `123` under the name
 * `'foo'` you can do:
 * `sagaMiddleware.run(taskSagaFactory({foo: payload => Promise.resolve(123)}))`.
 * The acction names are used in the default error view so it's best to keep
 * them human readable.
 * A task can be in three possible states:
 * - Idle: it hasn't started yet, or it has succeeded
 * - Progress: the promise hasn't resolved yet
 * - Error: the promise rejected
 * The task doesn't have any success state, but a success action dispatch
 * mechanism. To process the tasks result i.e. the value of the resolved
 * promise, you can start the action with the `onSuccessDispatch` option, which
 * will be used as the type of the {SuccessAction}, which you can then subscribe
 * to in a reducer to store its {result} to the state.
 * @param {OwnProps} props
 * @param {OwnProps['children']} props.children - Accepts a function as a single
 * child, which will receive a `getTask` function as its only argument.
 * The `getTask` function takes a _task_ name and ID and returns the {Task}
 * object representing the _task_.
 * @example
 * sagaMiddleware.run(taskSagaFactory({
 *   square: payload =>
 *     new Promise(resolve => setTimeout(resolve, 1000, payload ** 2)),
 * }))
 * <Task>
 *   {getTask => {
 *     const task = getTask('square', 'foo')
 *     return (d
 *       <button
 *         disabled={task.progress}
 *         onClick={() => task.start({
 *           payload: 7,
 *           onSuccessDispatch: 'SQUARED',
 *         })}
 *       >
 *         start
 *       </button>
 *     )
 *   }}
 * </Task>
 * // Clicking on the button will dispatch the following action after a second
 * const successAction = {
 *   type: 'SQUARED',
 *   name: 'square',
 *   id: 'foo',
 *   payload: 7,
 *   result: 49,
 * }
 */
const Task = connect<StateProps, DispatchProps, OwnProps, GlobalState>(
  (state) => ({state: state.tasks}),
  (dispatch) => ({
    start: (name, id, { payload, onSuccessDispatch }) =>
      dispatch<TaskStartAction>({
        type: TASK__START,
        payload,
        id,
        name,
        onSuccessDispatch,
      }),
    cancel: (name, id) =>
      dispatch<TaskCancelAction>({
        type: TASK__CANCEL,
        id,
        name,
      }),
    dismissError: (name, id) =>
      dispatch<TaskDismissErrorAction>({
        type: TASK__DISMISS_ERROR,
        id,
        name,
      }),
  })
)(({ start, cancel, dismissError, children, state }: Props) => {
  return children((name, id) => {
    const taskInstanceState = state[name]?.[id]
    return {
      ...taskInstanceState,
      progress: taskInstanceState?.status === 'progress',
      error: taskInstanceState?.status === 'error',
      start: (options) => start(name, id, options),
      cancel: () => cancel(name, id),
      retry: () => start(name, id, taskInstanceState),
      dismissError: () => dismissError(name, id),
    }
  // We need to cast to any here because of a bug in the React.FunctionalComponent
  // type, which only allows returning ReactElement<any, any> from a functional
  // component instead of a ReactNode e.g. string or number
  }) as any
})

interface TaskStatusProps {
  name: string
  id: string
  noun?: React.ReactNode
  progressMessage?: React.ReactNode
  startOnRender?: StartOptions
  renderError?: typeof Err
  renderProgress?: typeof ProgressIndicator
  children?: () => React.ReactNode
}


/**
 * Renders the progress or error states of a _task_ or nothing
 * @param {Object} props
 * @param {string} props.name - The _task_ name
 * @param {string} props.id - The _task_ id
 * @param {string} [props.noun=props.name] - The noun that should be used in the
 * error view e.g. "Could not load <noun>"
 * @param {string} [props.progressMessage='Loading <noun>'] - The message that
 * will be forwarded to the progress view
 * @param {Progress} [props.renderProgress=ProgressIndicator] - You can override
 * the default progress view
 * @param {Component} [props.renderError=Err] - You can override the default
 * error view
 * @param {StartOptions} [props.startOnRender=] - If set to a {StartOptions}
 * object, it will also behave like the {StartOnRender} component
 * @param {() => ReactNode} [props.children] - A function whose return value
 * will be rendered if the task is not in progress or error
 * @example
 * <TaskStatus
 *   name="foo"
 *   id="foo"
 *   noun="Something"
 *   progressMessage="Loading something"
 *   startOnRender={{ payload: 123, onSuccessDispatch: 'FOO'}}
 * />
 */
export const TaskStatus = ({
  name,
  id,
  noun = name,
  startOnRender,
  progressMessage,
  renderError = Err,
  renderProgress = ProgressIndicator,
  children = () => null,
}: TaskStatusProps) => (
  <Task>
    {(getTask) => {
      const {
        start,
        status,
        progress,
        error,
        payload,
        errorMessage,
        onSuccessDispatch,
      } = getTask(name, id)
      return (
        <>
          {!!startOnRender && (
            <StartOnRender {...startOnRender} {...{ name, id }} />
          )}
          {progress && renderProgress({ message: progressMessage })}
          {error &&
            renderError({
              noun,
              errorMessage,
              retry: () => start({ payload, onSuccessDispatch }),
            })}
          {!status && children()}
        </>
      )
    }}
  </Task>
)

export default Task
