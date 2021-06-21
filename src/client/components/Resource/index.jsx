import _ from 'lodash'
import React from 'react'

import multiInstance from '../../utils/multiinstance'
import { apiProxyAxios } from '../Task/utils'
import Task from '../Task'

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
        // ignoreIfInProgress: true,
      }}
    >
      {() => result !== undefined && children(result)}
    </Task.Status>
  ),
})

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
