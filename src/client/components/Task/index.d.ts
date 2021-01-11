export type Task<P, R> = (payload: P) => Promise<R>

export type TaskSuccessAction<T, R, P = any> = {
  type: T,
  result: R,
  payload: P,
}
