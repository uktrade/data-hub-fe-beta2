/**
 * If any changes are done to this file which changes the way we use it then
 * PLEASE update the docs - https://github.com/uktrade/data-hub-frontend/tree/master/docs/Redux%20and%20Saga.md
 **/

import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { TASK__START, TASK__DISMISS_ERROR, TASK__CANCEL } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'

const nameIdPropTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

const startOnRenderPropTypes = {
  payload: PropTypes.any,
  onSuccessDispatch: PropTypes.string,
}

/**
 * @typedef SuccessAction
 * @property {string} type - The value of the {onSuccessDispatch} option
 * @property {string} name - The _task_ name
 * @property {string} id - The _task_ id
 * @property {any} payload - The payload with which the _task_ was started
 * @property {any} result - The result with which the _task_ succeeded
 */

/**
 * Task start options
 * @typedef StartOptions
 * @property {string} [onSuccessDispatch=] - This is a mechanism to process the
 * result of a _tasks_ success. If set, a {SuccessAction} with this value
 * as its `type` will be dispatched when the _task_ succeeds, but before the
 * _task_ is _cleared_.
 */

/**
 * The shape of the object returned by `getTask` in the `Task` component
 * @typedef Task
 * @property {'progress' | 'error'} status - The current status of the task
 * @property {Boolean} progress - Whether the task is in progress
 * @property {Boolean} error - Whether the task is in error state
 * @property {(name, id, StartOptions) => void} start - Starts a task.
 */

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
 * @param {Object} props
 * @param {(name, id) => Task} props.children - Accepts a function as a single
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
const Task = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, { payload, onSuccessDispatch }) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        onSuccessDispatch,
      }),
    cancel: (name, id) =>
      dispatch({
        type: TASK__CANCEL,
        id,
        name,
      }),
    dismissError: (name, id) =>
      dispatch({
        type: TASK__DISMISS_ERROR,
        id,
        name,
      }),
  })
)(function Task({ start, cancel, dismissError, children, ...props }) {
  return children((name, id) => {
    const taskState = get(props, [name, id], {})
    return {
      ...taskState,
      progress: taskState.status === 'progress',
      error: taskState.status === 'error',
      start: (options) => start(name, id, options),
      cancel: () => cancel(name, id),
      retry: () => start(name, id, taskState),
      dismissError: () => dismissError(name, id),
    }
  })
})

Task.propTypes = {
  children: PropTypes.func.isRequired,
}

/**
 * Starts a task, if not in _progress_ or _error_ state when the component is
 * renderded.
 * @param {Object} props
 * @param {string} props.name - The _task_ name
 * @param {string} props.id - The _task_ id
 * @param {any} [props.payload=] - The payload start the _task_ with
 * @param {string} [props.onSuccessDispatch=] - If set, a {SuccessAction} with
 * this value as its {type} will be dispatched
 * @example
 * <Task.StartOnRender name="foo" id="a" payload={123} onSuccessDispatch="FOO"/>
 */
Task.StartOnRender = connect(
  (state, { name, id }) => get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (options) =>
      dispatch({
        ...options,
        type: TASK__START,
        id,
        name,
      }),
  })
)(({ start, name, id, payload, onSuccessDispatch, status }) => {
  useEffect(() => {
    status || start({ payload, onSuccessDispatch })
  }, [name, id, JSON.stringify(payload), onSuccessDispatch])
  return null
})

Task.StartOnRender.propTypes = {
  ...nameIdPropTypes,
  ...startOnRenderPropTypes,
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
 * <Task.Status
 *   name="foo"
 *   id="foo"
 *   noun="Something"
 *   progressMessage="Loading something"
 *   startOnRender={{ payload: 123, onSuccessDispatch: 'FOO'}}
 * />
 */
Task.Status = ({
  name,
  id,
  noun = name,
  startOnRender,
  progressMessage,
  renderError = Err,
  renderProgress = ProgressIndicator,
  children = () => null,
}) => (
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
            <Task.StartOnRender {...startOnRender} {...{ name, id }} />
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

Task.Status.propTypes = {
  ...nameIdPropTypes,
  noun: PropTypes.string,
  progressMessage: PropTypes.string,
  startOnRender: PropTypes.shape(startOnRenderPropTypes),
  renderProgress: PropTypes.elementType,
  renderError: PropTypes.elementType,
}

export default Task
