import {State as TasksState} from './Task/types'

export type Reducer<S, A> = (state: S, action: A) => S

export interface GlobalState {
  tasks: TasksState
}