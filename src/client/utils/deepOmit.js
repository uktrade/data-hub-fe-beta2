/**
 * @function deepOmit
 * @description A better alternative to Lodash's {omit}, whose dot syntax for
 * deep paths doesn't work with properties containing dots.
 * Also {omit} will be removed in Lodash 5.0
 * @param {Record<string, any>} o - The source object
 * @param {string[]} path - A path to part of the structure to be removed
 * @returns {Record<string, any>} - A copy of the source object with the
 * property at the path removed.
 * @example
 * deepOmit(
 *  {a: {b: {c: 'C', cc: 'CC'}, bb: 'BB'}, aa: 'AA'}},
 *  ['a'],
 * )
 * // => {aa: 'AA'}
 *
 * deepOmit(
 *  {a: {b: {c: 'C', cc: 'CC'}, bb: 'BB'}, aa: 'AA'}},
 *  ['a', 'b'],
 * )
 * // => {a: {bb: 'BB'}, aa: 'AA'}}
 *
 * deepOmit(
 *  {a: {b: {c: 'C', cc: 'CC'}, bb: 'BB'}, aa: 'AA'}},
 *  ['a', 'b', 'c'],
 * )
 * // => {a: {b: {cc: 'CC'}, bb: 'BB'}, aa: 'AA'}
 */
const deepOmit = (o, [p, ...ps]) =>
  Object.entries(o).reduce(
    (a, [k, v]) => ({
      ...a,
      // Can this one-liner get any prettier (pun intended)?
      ...(k === p ? (ps.length ? { [k]: deepOmit(v, ps) } : {}) : { [k]: v }),
    }),
    {}
  )

export default deepOmit
