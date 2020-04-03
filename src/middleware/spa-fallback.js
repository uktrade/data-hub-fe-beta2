/**
 * An express middleware which adds `basePath` to `res.locals`.
 * It must be applied in front of a request handler of a route
 * which must have a trailing asterisk e.g. `/foo/bar/*`.
 * You should use the `spaFallbackSpread` instead, which prevents the accidental
 * omission of adding the asterisk.
 */
const spaFallback = (req, res, next) => {
  // We need to remove the trailing part of the path configured in the express
  // route with a trailing asterisk (*), which is always stored in req.params[0]
  const basePath =
    req.originalUrl.slice(0, -req.params[0].length) || req.originalUrl
  if (basePath && !(basePath === '/' || basePath.match(/^\/.*[^/]$/))) {
    throw Error(
      `Misformatted basePath "${res.locals.basePath}"! ` +
        'The basePath must start and must not end with a slash "/".'
    )
  }
  res.locals.basePath = basePath
  next()
}

/**
 * Combines the two steps of appending an asterisk to the end of a route and
 * adding the `spaFallback` middleware into one step. The result of the call
 * is an array, which should be spread into the Express route definition
 * @example
 * // The following expressions are equivalent
 * app.get(...spaFallback('/foo'), requestHandler)
 * app.get('/foo' + '*', spaFallbackSpread, requestHandler)
 * @param {String} route - An Express route string
 */
const spaFallbackSpread = (route) => [`${route}*`, spaFallback]

module.exports = {
  spaFallbackSpread,
}
