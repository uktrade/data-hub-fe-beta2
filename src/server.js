require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('../config')
const express = require('express')
const raven = require('raven')
const flash = require('connect-flash')
const csrf = require('csurf')
const slashify = require('slashify')
const churchill = require('churchill')
const enforce = require('express-sslify')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const minifyHTML = require('express-minify-html')
const i18n = require('i18n-future').middleware()

const title = require('./middleware/title')
const breadcrumbs = require('./middleware/breadcrumbs')
const currentJourney = require('./modules/form/current-journey')
const nunjucks = require('../config/nunjucks')
const headers = require('./middleware/headers')
const locals = require('./middleware/locals')
const metadata = require('./lib/metadata')
const user = require('./middleware/user')
const auth = require('./middleware/auth')
const store = require('./middleware/store')
const csrfToken = require('./middleware/csrf-token')
const errors = require('./middleware/errors')
const sessionStore = require('./middleware/session-store')
const ssoBypass = require('./middleware/sso-bypass')
const logger = require('../config/logger')
const basicAuth = require('./middleware/basic-auth')
const features = require('./middleware/features')

const routers = require('./apps/routers')

const app = express()

app.disable('x-powered-by')

if (config.sentryDsn) {
  logger.info('Sentry DSN detected. Raven will be enabled.')
  // See https://docs.sentry.io/clients/node/config/
  // and https://docs.sentry.io/clients/node/usage/
  // for info on Raven config options
  raven.config(config.sentryDsn, {
    autoBreadcrumbs: true,
    captureUnhandledRejections: true,
  }).install()
  // Raven request handler must be the first middleware
  app.use(raven.requestHandler())
}

if (!config.ci) {
  app.use(churchill(logger))
}

if (!config.isDev) {
  app.enable('trust proxy')
  app.use(enforce.HTTPS({
    trustProtoHeader: true,
  }))
}

app.use(cookieParser())
app.use(sessionStore)

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

app.use(compression())
app.use(i18n)

app.set('view engine', 'njk')
nunjucks(app, config)

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
  },
}))

// Static files
app.use(favicon(path.join(config.root, 'public/images', 'favicon.ico')))
app.use(express.static(path.join(config.root, 'public')))
app.use('/js', express.static(path.join(config.buildDir, 'js')))
app.use('/css', express.static(path.join(config.buildDir, 'css')))
app.use('/images', express.static(path.join(config.buildDir, 'images')))
app.use('/fonts', express.static(path.join(config.buildDir, 'fonts')))

app.use(title())
app.use(breadcrumbs.init())
app.use(breadcrumbs.setHome())

app.use(currentJourney())

app.use(flash())

app.use(ssoBypass())
app.use(basicAuth)
app.use(auth)
app.use(user)
app.use(features)
app.use(locals)
app.use(headers)
app.use(store())
app.use(csrf())
app.use(csrfToken())

// routing
app.use(slashify())
app.use(routers)

// Raven error handler must come before other error middleware
if (config.sentryDsn) {
  app.use(raven.errorHandler())
}

app.use(errors.notFound)
app.use(errors.catchAll)

metadata.fetchAll((errors) => {
  if (errors) {
    logger.log('error', 'Unable to load all metadataRepository, cannot start app')

    for (const err of errors) {
      throw err
    }
  } else {
    app.listen(config.port, () => {
      logger.log('info', 'app listening on port %s', config.port)
    })
  }
})
