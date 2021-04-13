import _ from 'lodash'

import deepOmit from '../../utils/deepOmit'
import {
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__CLEAR,
  TASK__CANCEL,
} from '../../actions'

const setTaskState = (state, { name, id, ...action }, status, omitArgs) => {
  const currentTaskGroup = state[name] || {}
  const currentTask = currentTaskGroup[id]
  return {
    ...state,
    [name]: {
      ...currentTaskGroup,
      [id]: {
        ..._.omit(currentTask, omitArgs),
        ...action,
        status,
      },
    },
  }
}

const remove = (state, { name, id }) => {
  const taskState = state[name]

  return taskState
    ? deepOmit(state, [
        name,
        // If this is the last task in the group, remove the whole group
        ...(_.isEqual(Object.keys(taskState), [name]) ? [] : [id]),
      ])
    : state
}

export default (state = {}, { type, ...action }) => {
  switch (type) {
    case TASK__PROGRESS:
      return setTaskState(state, action, 'progress', 'errorMessage')
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
