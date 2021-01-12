import {useEffect} from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'

import {TASK__START} from '../../actions'
import {GlobalState} from '../types'

import {TaskInstanceState, TaskStartAction} from './types'
import {StartOptions} from '.'

export interface OwnProps {
  name: string
  id: string
  payload?: any
  onSuccessDispatch?: string
}

export interface DispatchProps {
  start(options: StartOptions): void
}

export interface Props extends OwnProps, DispatchProps, TaskInstanceState {}

/**
 * Starts a task, if not in _progress_ or _error_ state when the component is
 * renderded.
 * @param {OwnProps} props
 * @param {string} props.name - The _task_ name
 * @param {string} props.id - The _task_ id
 * @param {any} [props.payload=] - The payload start the _task_ with
 * @param {string} [props.onSuccessDispatch=] - If set, a {SuccessAction} with
 * this value as its {type} will be dispatched
 * @example
 * <StartOnRender name="foo" id="a" payload={123} onSuccessDispatch="FOO"/>
 */
export default connect<TaskInstanceState, DispatchProps, OwnProps, GlobalState>(
  ({tasks}, { name, id }) => tasks[name]?.[id],
  (dispatch, { id, name }) => ({
    start: (options) =>
      dispatch<TaskStartAction>({
        ...options,
        type: TASK__START,
        id,
        name,
      }),
  })
)(({ start, name, id, payload, onSuccessDispatch, status }: Props) => {
  useEffect(() => {
    status || start({ payload, onSuccessDispatch })
  }, [name, id, JSON.stringify(payload), onSuccessDispatch])
  return null
})