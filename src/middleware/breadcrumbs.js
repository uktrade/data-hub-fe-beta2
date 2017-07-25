/**
 * Easy to use generic breadcrumbs middleware for Express.
 */

const {
  isArray,
  isObject,
  each,
  extend,
  find,
  findIndex,
} = require('lodash')

/**
 * Breadcrumbs initialization.
 * Intializes Breadcrumbs for incoming requests, adds `breadcrumbs()` method to `res`.
 *
 * Examples:
 *      app.use(breadcrumbs.init())
 *
 * @return {Function}
 */
function init () {
  let breadcrumbs = []

  function exists (breadcrumb) {
    return findIndex(breadcrumbs, breadcrumb) !== -1
  }

  function updateBreadcrumb (existingName, { name, url }) {
    const index = findIndex(breadcrumbs, (breadcrumb) => {
      return breadcrumb.name.toLowerCase() === existingName.toLowerCase()
    })

    if (index >= 0) {
      if (name) {
        breadcrumbs[index].name = name
      }
      if (url) {
        breadcrumbs[index].url = url
      }
    }
  }

  function addBreadcrumbs (name, url) {
    if (arguments.length === 1) {
      if (isArray(name)) {
        each(name, (breadcrumb) => {
          if (!exists(breadcrumb)) {
            breadcrumbs.push(breadcrumb)
          }
        })
      } else if (isObject(name)) {
        if (!exists(name)) {
          breadcrumbs.push(name)
        }
      } else {
        if (!exists(name)) {
          breadcrumbs.push({ name: name })
        }
      }
    } else if (arguments.length === 2) {
      if (!exists(name)) {
        breadcrumbs.push({
          name: name,
          url: url,
        })
      }
    }
  }

  function getBreadcrumbs () {
    return breadcrumbs
  }

  function cleanBreadcrumbs () {
    breadcrumbs = []
  }

  return function (req, res, next) {
    cleanBreadcrumbs()

    res.breadcrumb = {
      add: (...args) => {
        addBreadcrumbs(...args)
        return res
      },
      get: getBreadcrumbs,
      update: (existingName, { name, url }) => {
        updateBreadcrumb(existingName, { name, url })
        return res
      },
    }

    next()
  }
}

/**
 * Set Breadcrumbs home information.
 *
 * Examples:
 *      app.use(breadcrumbs.setHome())
 *      app.use('/admin', breadcrumbs.setHome({
 *        name: 'Dashboard',
 *        url: '/admin'
 *      }))
 *
 * @param {Object} options
 *  - name    home name, default `Home`
 *  - url     home url, default `/`
 * @return {Function}
 */
function setHome (options = {}) {
  const homeName = options.name || 'Home'
  const homeUrl = options.url || '/'

  return function (req, res, next) {
    const homeBreadcrumb = find(res.breadcrumb.get(), (breadcrumb) => {
      return breadcrumb._home
    })

    if (!homeBreadcrumb) {
      res.breadcrumb.add({
        name: homeName,
        url: homeUrl,
        _home: true,
      })
    } else {
      extend(homeBreadcrumb, {
        name: homeName,
        url: homeUrl,
      })
    }

    next()
  }
}

module.exports = {
  init,
  setHome,
}
