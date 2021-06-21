import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import multiInstance from '../../utils/multiinstance'
import { apiProxyAxios } from '../Task/utils'
import Task from '../Task'

/**
 * @function Resource
 * This component abstracts away the loading of a resource which has an ID.
 * It's basically a {Task} whith the result persisted in the state without the
 * need to deal with the {onSuccessDispatch} mechanism and to add any reducers.
 * @param {Object} props
 * @param {string} props.name - The name of the task which loads the resource
 * @param {string} props.id - The unique ID of the resource for the given name.
 * The ID will be the task's payload.
 * @param {result -> React.node} props.children - The single child should be
 * a function which will be passed the value the task resolves with with its
 * attributes deeply converted from snake to camel case in case it's an object.
 * @example
 * <Resource name="My task name" id="foo">
 *   {result =>
 *     <pre>{JSON.stringify(result, null, 2)}</pre>
 *   }
 * </Resource>
 */
const Resource = multiInstance({
  name: 'Resource',
  actionPattern: 'RESOURCE',
  reducer: (_, { result }) => ({ result }),
  component: ({ name, id, taskStatusProps, children, result }) => (
    <Task.Status
      {...taskStatusProps}
      name={name}
      id={id}
      startOnRender={{
        onSuccessDispatch: 'RESOURCE',
        payload: id,
        ignoreIfInProgress: true,
      }}
    >
      {() => result !== undefined && children(result)}
    </Task.Status>
  ),
})

Resource.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
  taskStatusProps: Task.Status.propTypes,
}

export default Resource

const deepKeysToCamelCase = (x) =>
  Object.fromEntries(
    Object.entries(x).map(([k, v]) => [
      _.camelCase(k),
      _.isPlainObject(v)
        ? deepKeysToCamelCase(v)
        : Array.isArray(v)
        ? v.map(deepKeysToCamelCase)
        : v,
    ])
  )

/**
 * A utility factory for creating a {Resource} preset to a specific API endpoint
 * @param {string} name - The name of the resource and its task.
 * @param {*} endpoint - The path of the API endpoint for the given resource
 * without the leading slash.
 * @returns A resource component preconfigured for a specific task name,
 * which doesn't require the {name} prop.
 * @example
 * const Company = createResource('Company', 'v4/company')
 * // Then in src/client/index.jsx you can just spread Company.tasks into
 * // the tasks prop of the Provider component
 * <Provider tasks={{
 *   // ...
 *   ...Company.tasks,
 * }}>
 *   // ...
 * </Provider/>
 */
export const createResource = (name, endpoint) => {
  const Component = (props) => <Resource {...props} name={name} />
  Component.propTypes = _.omit(Component.propTypes, 'name')
  Component.tasks = {
    [name]: (id) =>
      apiProxyAxios
        .get(`/api-proxy/${endpoint}/${id}`)
        .then(({ data }) => deepKeysToCamelCase(data)),
  }

  return Component
}
