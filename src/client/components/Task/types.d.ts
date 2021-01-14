import { TASK__CLEAR, TASK__ERROR, TASK__PROGRESS, TASK__START, TASK__CANCEL, TASK__DISMISS_ERROR } from "../../actions"
import componentTypes from '../types'

export type Task<P = any, R = any> = (payload: P) => Promise<R>

export interface TaskActionBase {
  id: string
  name: string
}

export interface TaskStartAction extends TaskActionBase {
  type: typeof TASK__START
  payload?: any
  onSuccessDispatch?: string
}

export interface TaskProgressAction extends TaskActionBase {
  type: typeof TASK__PROGRESS
}

export interface TaskErrorAction extends TaskActionBase {
  type: typeof TASK__ERROR
  errorMessage: string
}

export interface TaskClearAction extends TaskActionBase {
  type: typeof TASK__CLEAR
}

export interface TaskCancelAction extends TaskActionBase {
  type: typeof TASK__CANCEL
}

export interface TaskDismissErrorAction extends TaskActionBase {
  type: typeof TASK__DISMISS_ERROR
}

export type TaskAction
  = TaskStartAction
  | TaskProgressAction
  | TaskErrorAction
  | TaskClearAction
  | TaskCancelAction
  | TaskDismissErrorAction

export interface TaskSuccessAction<T extends string = any, R = any, P = any> {
  type: T
  result: R
  payload: P
  name: string
  id: string
}

export type Status = 'progress' | 'error'

interface TaskInstanceState {
  status: Status
  payload?: any
  onSuccessDispatch?: string
  errorMessage?: string
}

interface TaskTypeState {
  [k: string]: TaskInstanceState
}

interface State {
  [k: string]: TaskTypeState
}

export type Reducer = componentTypes.Reducer<State, TaskAction>

export type Registry = {
  [k: string]: Task
}
