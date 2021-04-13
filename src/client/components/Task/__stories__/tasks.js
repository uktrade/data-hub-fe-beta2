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
    rejectWithFieldErrorsValue,
    rejectWithErrorStringValue,
    resolveValue,
    delay = 1000,
  }) =>
    new Promise((resolve, reject) => {
      // TODO: Remove the rejectWithFieldErrors logic
      const shouldReject = [
        'rejectWithFieldErrors',
        'rejectWithErrorString',
      ].includes(resolveOrReject)
      setTimeout(
        shouldReject ? reject : resolve,
        delay,
        shouldReject
          ? resolveOrReject === 'rejectWithErrorString'
            ? rejectWithErrorStringValue
            : rejectWithFieldErrorsValue
          : resolveValue
      )
    }),
}
