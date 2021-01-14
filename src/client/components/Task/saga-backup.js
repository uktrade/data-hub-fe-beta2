import { get } from 'lodash'
import { take, put, spawn, call, select } from 'redux-saga/effects'

import {
  TASK__START,
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__CLEAR,
  TASK__DISMISS_ERROR,
} from '../../actions'

function* taskSaga(task, action) {
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

function* dismissError() {
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

function* startTask(registry) {
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
        `Cannot start task "${name}.${id}" because it is already in progress!`
      )
    }
    yield spawn(taskSaga, task, action)
  }
}

/**
 * Creates the saga required for the `Task` component
 * @param {Object} registry - An object mapping _tasks_ to names.
 * A task is a function which takes a payload and returns a {Promise}.
 * @returns {Generator} - The saga
 */
export default (registry) =>
  function* tasksSaga() {
    yield spawn(startTask, registry)
    yield spawn(dismissError)
  }
