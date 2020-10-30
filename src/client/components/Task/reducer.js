import _ from 'lodash'
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

const remove = (state, { name, id }) => {
  const taskState = state[name]
  return taskState
    ? _.omit(
        state,
        _.isEqual(_.keys(taskState), [name]) ? name : `${name}.${id}`
      )
    : state
}

export default (state = {}, { type, ...action }) => {
  switch (type) {
    case TASK__PROGRESS:
      return setTaskState(state, action, 'progress')
    case TASK__ERROR:
      return setTaskState(state, action, 'error')
    case TASK__CANCEL:
      return remove(state, action)
    case TASK__CLEAR:
      return remove(state, action)
    default:
      return state
  }
}
