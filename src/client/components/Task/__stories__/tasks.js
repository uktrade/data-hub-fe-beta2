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
  'Dummy form task': ({ resolveOrReject, rejectValue, resolveValue, delay }) =>
    new Promise((resolve, reject) => {
      const shouldReject = resolveOrReject === 'reject'
      setTimeout(
        shouldReject ? reject : resolve,
        parseInt(delay, 10) || 1000,
        shouldReject ? JSON.parse(rejectValue) : resolveValue
      )
    }),
}
