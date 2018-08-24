const router = require('express').Router()
const fs = require('fs')

const { setHomeBreadcrumb } = require('./middleware')

const subApps = fs.readdirSync(__dirname)

const appsRouters = subApps.map(subAppDir => {
  const subApp = require(`./${subAppDir}`)

  if (subApp.mountpath) {
    return router.use(subApp.mountpath, setHomeBreadcrumb(subApp.displayName), subApp.router)
  } else if (subApp.router) {
    return router.use(subApp.router)
  }
  return (req, res, next) => next()
})

module.exports = appsRouters
