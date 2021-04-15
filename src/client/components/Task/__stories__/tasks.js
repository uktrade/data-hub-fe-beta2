export default {
  'Task cancellation demo': () => new Promise((r) => setTimeout(r, 5000)),
  'Dummy task': (payload) =>
    new Promise((resolve, reject) =>
      setTimeout(
        payload.reject ? reject : resolve,
        payload.timeout || 1000,
        payload.reject || payload
      )
    ),
  'Dummy form task': ({ resolveOrReject, value, delay = 1000 }) =>
    new Promise((resolve, reject) =>
      setTimeout(resolveOrReject === 'reject' ? reject : resolve, delay, value)
    ),
}
