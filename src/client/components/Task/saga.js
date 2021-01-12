import { get } from 'lodash'
import {
  take,
  put,
  spawn,
  fork,
  call,
  select,
  cancel,
} from 'redux-saga/effects'

import {
  TASK__START,
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__CLEAR,
  TASK__DISMISS_ERROR,
  TASK__CANCEL,
} from '../../actions'

/**
 * Starts a task and waits for its resolution or rejection
 * @param {Task} task - the task function
 * @param {TaskStartAction} action - the `TASK__START` action
 */
function* startTask(task, action) {
  yield put({ ...action, type: TASK__PROGRESS })
  try {
    const result = yield call(task, action.payload)
    const { id, name, payload, onSuccessDispatch } = action
    if (onSuccessDispatch) {
      yield put({
        type: onSuccessDispatch,
        name,
        id,
        payload,
        result,
      })
    }
    yield put({ type: TASK__CLEAR, id, name })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      const { id, name } = action
      yield put({
        type: TASK__ERROR,
        id,
        name,
        errorMessage: error,
      })
    }
  }
}

/**
 * Starts a {Task} and takes care of its cancellation
 * @param {Task} task - the task function
 * @param {TaskStartAction} action - the `TASK__START` action
 */
function* manageTask(task, action) {
  const s = yield fork(startTask, task, action)
  while (true) {
    yield take(
      ({ type, name, id }) =>
        type === TASK__CANCEL && name === action.name && id === action.id
    )
    yield cancel(s)
  }
}

/**
 * Subscribes to `TASK__DISMISS_ERROR` actions and dispatches the
 * `TASK__CLEAR` action if the given action is in an error state.
 */
function* subscribeToDismiss() {
  while (true) {
    const { id, name } = yield take(TASK__DISMISS_ERROR)
    const inError = yield select(
      (state) => get(state, ['tasks', name, id, 'status']) === 'error'
    )

    if (inError) {
      yield put({ type: TASK__CLEAR, id, name })
    }
  }
}

/**
 * Subscribes to `TASK__START` actions and starts managing the given task
 * @param {Record<string, Task>} registry - A registry of tasks
 */
function* subscribeToStart(registry) {
  while (true) {
    const action = yield take(TASK__START)
    const { name, id } = action
    const task = registry[action.name]
    if (!task) {
      throw Error(`Task "${name}" is not registered!`)
    }
    const status = yield select((state) =>
      get(state, ['tasks', name, id, 'status'])
    )
    if (status === 'progress') {
      throw Error(
        `Cannot start task "${name}.${id}" because it is already in progress. Cancel it first!`
      )
    }
    yield spawn(manageTask, task, action)
  }
}

/**
 * Creates the saga required for the `Task` component
 * @param {Object} registry - An object mapping _tasks_ to names.
 * A task is a function which takes a payload and returns a {Promise}.
 * @returns {Generator} - The saga
 */
export default (registry) =>
  function* () {
    yield spawn(subscribeToStart, registry)
    yield spawn(subscribeToDismiss)
  }
