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
  'Dummy form task': ({
    resolveOrReject,
    rejectValue,
    resolveValue,
    delay = 1000,
  }) =>
    new Promise((resolve, reject) => {
      const shouldReject = resolveOrReject === 'reject'
      setTimeout(
        shouldReject ? reject : resolve,
        delay,
        shouldReject ? rejectValue : resolveValue
      )
    }),
}
