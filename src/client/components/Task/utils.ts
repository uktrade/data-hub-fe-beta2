import axios from 'axios'
import { curry, identity } from 'lodash'

/**
 * A curried function which Decorates a task so, that it's progress will take
 * at least {duration} of milliseconds.
 * @param {Number} duration - Duration of the progress in milliseconds
 * @param {payload => Promise} task - _Task_ to be decorated
 * @returns {payload => Promise} - The decorated _task_
 * @example
 * const task = payload => new Promise(resolve => setTimeout(reslove, 5000))
 * const slowTask = delay(10000)(task) // Will take 10 seconds to resolve
 * const fastTask = delay(100)(task) // Will take 5 seconds to resolve
 */
export const delay = curry((duration, task, payload) =>
  Promise.all([
    task(payload),
    new Promise((resolve) => setTimeout(resolve, duration)),
  ]).then(([result]) => result)
)

export const catchApiError = ({ response: { data } }) =>
  Promise.reject(data.detail || data)

/**
 * A custom Axios instance for easy access to the `/api-proxy` endpoint.
 * It has its {baseURL} set to `/api-proxy/` so you should omit that part of the
 * path from the {url} of your request. It also handles API errors so that
 * if used in a task of the {Task} component, the correct error message will be
 * displayed in the {Task.Status}.
 */
export const apiProxyAxios = axios.create()
apiProxyAxios.interceptors.request.use(({ url, ...config }) => ({
  ...config,
  url: url.startsWith('/api-proxy') ? url : url.replace(/^\/?/, '/api-proxy/'),
}))
apiProxyAxios.interceptors.response.use(identity, ({ response }) =>
  Promise.reject(response.data.detail || response.statusText)
)
