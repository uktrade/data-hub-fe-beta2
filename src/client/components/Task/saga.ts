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

import {GlobalState} from '../types'
import {
  Registry,
  TaskStartAction,
  TaskProgressAction,
  TaskDismissErrorAction,
  Status,
  Task,
  TaskSuccessAction,
  TaskClearAction,
  TaskErrorAction,
  TaskCancelAction,
} from './types'

/**
 * Starts a task and waits for its resolution or rejection
 * @param {Task} task - the task function
 * @param {TaskStartAction} action - the `TASK__START` action
 */
function* startTask(task: Task, action: TaskStartAction) {
  yield put<TaskProgressAction>({ ...action, type: TASK__PROGRESS })
  try {
    const result = yield call(task, action.payload)
    const { id, name, payload, onSuccessDispatch } = action
    if (onSuccessDispatch) {
      yield put<TaskSuccessAction>({
        type: onSuccessDispatch,
        name,
        id,
        payload,
        result,
      })
    }
    yield put<TaskClearAction>({ type: TASK__CLEAR, id, name })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      const { id, name } = action
      yield put<TaskErrorAction>({
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
function* manageTask(task: Task, action: TaskStartAction) {
  const s = yield fork(startTask, task, action)
  while (true) {
    // We have to pass the any type here because of a bug in redux-saga typings
    yield take<any>(
      ({ type, name, id }: TaskCancelAction) =>
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
    const { id, name } = (yield take(TASK__DISMISS_ERROR)) as TaskDismissErrorAction
    const inError = yield select(
      (state: GlobalState) => state.tasks[name]?.[id]?.status === 'error'
    )

    if (inError) {
      yield put<TaskClearAction>({ type: TASK__CLEAR, id, name })
    }
  }
}

/**
 * Subscribes to `TASK__START` actions and starts managing the given task
 * @param {Registry} registry - A registry of tasks
 */
function* subscribeToStart(registry: Registry) {
  while (true) {
    const action = (yield take(TASK__START)) as TaskStartAction
    const { name, id } = action
    const task = registry[action.name]
    if (!task) {
      throw Error(`Task "${name}" is not registered!`)
    }
    const status: Status = yield select((state: GlobalState) =>
      state.tasks[name]?.[id]?.status
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
 * @param {Registry} registry - An object mapping _tasks_ to names.
 * A task is a function which takes a payload and returns a {Promise}.
 * @returns {Generator} - The saga
 */
export default (registry: Registry) =>
  function* () {
    yield spawn(subscribeToStart, registry)
    yield spawn(subscribeToDismiss)
  }
