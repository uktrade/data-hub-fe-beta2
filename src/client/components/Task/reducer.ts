import _ from 'lodash'
import {
  TASK__PROGRESS,
  TASK__ERROR,
  TASK__CLEAR,
  TASK__CANCEL,
} from '../../actions'

import {
  Reducer,
  State,
  Status,
  TaskProgressAction,
  TaskErrorAction,
  TaskAction,
} from './types'

const setTaskState = (
  state: State,
  { name, id, ...action }: TaskProgressAction | TaskErrorAction,
  status: Status
) => {
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

const remove = (state: State, { name, id }: TaskAction) => {
  const taskState = state[name]
  return taskState
    ? _.omit(
        state,
        _.isEqual(_.keys(taskState), [name]) ? name : `${name}.${id}`
      )
    : state
}

const reducer: Reducer = (state = {}, action) => {
  switch (action.type) {
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

export default reducer
