const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const root = path.normalize(`${__dirname}/..`)

const buildRedisConfig = () => {
  const metadataTtl = process.env.METADATA_TTL || 15 * 60
  const vcap = process.env.VCAP_SERVICES
    ? JSON.parse(process.env.VCAP_SERVICES)
    : JSON.parse('{}')

  if (vcap.hasOwnProperty('redis')) {
    return {
      metadataTtl,
      url: vcap.redis[0].credentials.uri,
      port: vcap.redis[0].credentials.port,
      host: vcap.redis[0].credentials.host,
      useTLS: vcap.redis[0].credentials.tls_enabled,
    }
  }

  return {
    metadataTtl,
    url: process.env.REDIS_URL || process.env.REDISTOGO_URL,
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'redis',
    useTLS: process.env.REDIS_USE_TLS,
  }
}

const config = {
  root,
  buildDir: path.join(root, '.build'),
  env: process.env.NODE_ENV,
  ci: process.env.CI,
  isDev,
  isProd,
  isTest,
  noCache: process.env.CACHE_ASSETS ? false : isDev,
  port: process.env.PORT || 3000,
  apiRoot: process.env.API_ROOT || 'http://localhost:8000',
  api: {
    authUrl: '/token/',
  },
  postcodeLookup: {
    apiKey: process.env.POSTCODE_KEY,
    baseUrl: 'https://api.getAddress.io/v2/uk/{postcode}?api-key={api-key}',
  },
  regionLookup: {
    baseUrl: 'https://ukregionlookup.cloudapps.digital/pcode={postcode}',
  },
  redis: buildRedisConfig(),
  cacheDurationShort: process.env.CACHE_DURATION_SHORT || 100,
  cacheDurationLong: process.env.CACHE_DURATION_LONG || 1000,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  session: {
    secret: process.env.SESSION_SECRET,
    // 2 hour timeout
    ttl: process.env.SESSION_TTL || 2 * 60 * 60 * 1000,
  },
  assetsHost: process.env.ASSETS_HOST,
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'error'),
  zen: {
    // TODO tidy up the configuration of zendesk URLs
    url: `https://${process.env.ZEN_DOMAIN}.zendesk.com/api/v2/tickets.json`,
    announcementsURL: process.env.ZEN_ANNOUNCEMENT_URL,
    token: process.env.ZEN_TOKEN,
    email: process.env.ZEN_EMAIL,
    browser: process.env.ZEN_BROWSER,
    impact: process.env.ZEN_IMPACT,
    service: process.env.ZEN_SERVICE,
    serviceChannel: process.env.ZEN_SERVICE_CHANNEL || 'datahub',
  },
  // @TODO - remove when demo site is decommissioned
  projectPhase: process.env.PROJECT_PHASE || 'beta',
  sentryDsn: process.env.SENTRY_DSN,
  currencyFormat: '$0,0.00',
  longDateFormat: 'D MMMM YYYY',
  mediumDateFormat: 'D MMM YYYY',
  mediumDateTimeFormat: 'D MMM YYYY, h:mma',
  paginationMaxResults: 10000,
  performanceDashboardsUrl: process.env.PERFORMANCE_DASHBOARDS_URL,
  findExportersUrl: process.env.FIND_EXPORTERS_URL,
  archivedDocumentsBaseUrl: process.env.ARCHIVED_DOCUMENTS_BASE_URL,
  oauth: {
    url: process.env.OAUTH2_AUTH_URL,
    clientId: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    redirectUri: process.env.OAUTH2_REDIRECT_URL,
    tokenFetchUrl: process.env.OAUTH2_TOKEN_FETCH_URL,
    logoutUrl: process.env.OAUTH2_LOGOUT_URL,
    devToken: process.env.OAUTH2_DEV_TOKEN,
    bypassSSO: process.env.OAUTH2_BYPASS_SSO || false,
    userProfileUrl: process.env.OAUTH2_USER_PROFILE_URL,
  },
  basicAuth: {
    user: process.env.BASIC_AUTH_USER,
    password: process.env.BASIC_AUTH_PASSWORD,
  },
  hawkCredentials: {
    dataHubBackend: {
      id: process.env.DATA_HUB_BACKEND_ACCESS_KEY_ID,
      key: process.env.DATA_HUB_BACKEND_SECRET_ACCESS_KEY,
      algorithm: 'sha256',
    },
  },
  oneList: {
    email: process.env.ONE_LIST_EMAIL || 'one.list@example.com',
  },
  currencyRate: {
    usdToGbp: 0.750148,
  },
  activityFeed: {
    paginationSize: 20,
    supportedActivityTypes: [
      'dit:Interaction',
      'dit:ServiceDelivery',
      'dit:InvestmentProject',
      'dit:OMISOrder',
    ],
  },
  helpCentre: {
    url: process.env.HELP_CENTRE_URL,
    announcementsURL: process.env.HELP_CENTRE_ANNOUNCMENTS_URL,
    apiFeed: process.env.HELP_CENTRE_API_FEED,
    token: process.env.HELP_CENTRE_FEED_API_TOKEN,
  },
  greatProfileUrl: process.env.GREAT_PROFILE_URL,
}

module.exports = config
