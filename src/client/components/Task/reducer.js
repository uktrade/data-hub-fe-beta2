import { omit } from 'lodash'
import {
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__CLEAR,
  TASK__CANCEL,
} from '../../actions'

const setTaskState = (state, { name, id, ...action }, status) => {
  const currentTaskGroup = state[name] || {}
  const currentTask = currentTaskGroup[id]
  return {
    ...state,
    [name]: {
      ...currentTaskGroup,
      [id]: {
        ...currentTask,
        ...action,
        status,
      },
    },
  }
}

const clearState = (state, action) =>
  omit(
    state,
    Object.entries(state[action.name] || {}).length > 1
      ? `${action.name}.${action.id}`
      : // Remove the whole task group if removing its last task
        action.name
  )

export default (state = {}, { type, ...action }) => {
  switch (type) {
    case TASK__PROGRESS:
      return setTaskState(state, action, 'progress')
    case TASK__ERROR:
      return setTaskState(state, action, 'error')
    case TASK__CLEAR:
      return clearState(state, action)
    case TASK__CANCEL:
      return clearState(state, action)
    default:
      return state
  }
}
