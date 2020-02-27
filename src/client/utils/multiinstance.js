import { omit, isEmpty, curry } from 'lodash'
import * as reactRedux from 'react-redux'
import PropTypes from 'prop-types'

/**
 * Takes an ordinary _id unaware_ reducer and returns its _id aware_ version
 * @default
 * An _id aware_ reducer requires that its actions have an `id` property.
 * The state the reducer returns is a map of IDs to states created with the
 * decorated reducer. On each call of the reducer the state corresponding to
 * the ID of the action is updated. You wou
 * @param {(state, action: {type: string})} reducer - An _id unaware_ reducer.
 * @returns An _id aware_ reducer.
 * @example
 * const reducer = (state = 0, {type}) =>
 *   type === 'INC' ? state + 1 : state
 *
 * const idAwareReducer = reducerDecorator(reducer)
 *
 * const state1 = idAwareReducer(undefined, { type: 'INC', id: 'foo' })
 * // {foo: 1}
 * const state2 = idAwareReducer(state1, { type: 'INC', id: 'bar' })
 * // {foo: 1, bar: 1}
 * const state3 = idAwareReducer(state2, { type: 'INC', id: 'foo' })
 * // {foo: 2, bar: 1}
 */
export const reducerDecorator = (reducer) => (
  state = {},
  { id, type, ...action }
) => {
  if (id) {
    const nextState = reducer(state[id], { type, ...action })
    return isEmpty(nextState) ? omit(state, id) : { ...state, [id]: nextState }
  }
  return state
}

const interceptDispatch = (dispatch, id) => ({ type, ...action }) =>
  dispatch({
    ...action,
    type,
    id,
  })

/**
 * An _id aware_ wrapper of `react-redux.connect`
 * @description
 * Works like `react-redux.connect`, with some exceptions:
 * - The resulting connected component will required the `id` prop.
 * - It's dispatch is intercepted so, that it automatically adds the `id` to all
 *   actions. The original action excluding its type is attached to the `action`
 *   property of the dispatched action.
 * - The first argument of `mapComponentToProps` will be the state specific
 *   to the ID assigned to the instance of the component. The other arguments
 *   are the original `mapComponentToProps`, i.e. the global redux state and
 *   the component props.
 * - It requires one extra argument after the wrapped component, which should
 *   be the property name to which the components _id aware_ reducer was plugged
 *   in. You can pass it alongside the wrapped component or in another pair of
 *   parentheses as the function `connect()` returns is curried.
 * @example
 * const Counter = ({count, onIncrease}) =>
 *  <button onClick={onIncrease}>{count}</button>
 *
 * const IdAwareCounter = connect(
 *   state => ({count: state}),
 *   dispatch => ({onIncrease: () => dispatch({type: 'INC'})}),
 * )(Counter, 'counterState')
 *
 * // The IdAwareCounter expects an id aware reducer to be plugged in to the
 * // root reducer at "counterState"
 * const store = createStore(combineReducers({
 *   counterState: idAwareCounterReducer,
 * }))
 */
export const connect = (componentState2props, dispatch2props, ...rest) =>
  curry((component, name) => {
    // We use this instead of the default argument value to also allow for
    // ignoring this by passing null, to stick to the original connect signature
    componentState2props = componentState2props || ((x) => x)
    const Connected = reactRedux.connect(
      (state, props) =>
        componentState2props(state[name]?.[props.id], state, props),
      dispatch2props &&
        ((dispatch, props, ...rest) =>
          dispatch2props(
            interceptDispatch(dispatch, props.id),
            props,
            ...rest
          )),
      ...rest
    )(({ dispatch, ...props }) =>
      component({ ...props, dispatch: interceptDispatch(dispatch, props.id) })
    )
    Connected.propTypes = {
      id: PropTypes.string.isRequired,
    }
    return Connected
  })

/**
 * @function multiinstance
 * Combines the two steps of decorating a reducer and connecting a component
 * to make them _id aware_ into a single step
 * @param {Object} options
 * @param {String} options.name - The name under which the component should be
 * connected to the global redux state
 * @param {React.Component} options.component - The stateless component which
 * will be forwareded to the underlying {connect} function
 * @param {(state, action) => state} options.reducer - The reducer managing the
 * component's state which will be passed to the underlying {reducerDecorator}
 * @param {ComponentStateToProps} [options.componentStateToProps=] - The
 * {componentStateToProps} function which will be passed to the underlying
 * {reducerDecorator}
 * @param {DispatchStateToProps} [options.dispatchToProps=] - The
 * {dispatchToProps} function which will be passed to the underlying
 * {reducerDecorator}
 * @param {Array} [options.connectArgs=[]] - Will be spread as arguments to the
 * first part of the underlying `react-redux.connect` after
 * {componentStateToProps} and {dispatchToProps}.
 * @returns An _id aware_ connected component with a `reducerSpread` property,
 * which is an object where the _id aware_ reducer is assigned to the {name}.
 * This is meant to be spread into `redux.combineReducers`.
 * @example
 * const Counter = multiinstance({
 *   name: 'counterState',
 *   reducer: (state = 0, {type}) => type === 'INC' ? state + 1 : state,
 *   component:({count, onIncrease}) =>
 *     <button onClick={onIncrease}>{count}</button>,
 * })
 *
 * // The reducerSpread is just an object where the id aware reducer is assigned
 * // to the value of the name option, in this case "counterState"
 * console.log(Counter.reducerSpread)
 * // {counterState: <decorated counter reducer>}
 *
 * const store = createStore(combineReducers({
 *   // So we can use it like this and we can be sure that both the reducer
 *   // and the component are connected to the same part of the state
 *   ...Counter.redcerSpread,
 * }))
 *
 * const App = () =>
 *   <div>
 *     // Each counter will now keep it's own state
 *     <Counter id="foo" />
 *     <Counter id="bar" />
 *     <Counter id="baz" />
 *   </div>
 */
export default ({
  name,
  component,
  reducer,
  connectArgs = [],
  componentStateToProps = (x) => x,
  dispatchToProps,
}) => {
  console.assert(component, 'component is required')
  console.assert(reducer, 'reducer is required')
  console.assert(name, 'name is required')
  const Connected = connect(
    componentStateToProps,
    dispatchToProps,
    ...connectArgs
  )(component)(name)

  Connected.reducerSpread = { [name]: reducerDecorator(reducer) }
  return Connected
}
