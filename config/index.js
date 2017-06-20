const path = require('path')

const isDev = (process.env.NODE_ENV !== 'production')

module.exports = {
  root: path.normalize(`${__dirname}/..`),
  env: process.env.NODE_ENV,
  ci: process.env.CI,
  isDev,
  port: process.env.PORT || 3000,
  apiRoot: process.env.API_ROOT || 'http://localhost:8000',
  api: {
    authUrl: '/token/',
    clientId: process.env.API_CLIENT_ID,
    clientSecret: process.env.API_CLIENT_SECRET,
  },
  postcodeLookup: {
    apiKey: process.env.POSTCODE_KEY,
    baseUrl: 'https://api.getAddress.io/v2/uk/{postcode}?api-key={api-key}',
  },
  redis: {
    url: process.env.REDIS_URL || process.env.REDISTOGO_URL,
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'redis',
    metadataTtl: (process.env.METADATA_TTL || (15 * 60)),
  },
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    // 2 hour timeout
    ttl: process.env.SESSION_TTL || (2 * 60 * 60 * 1000),
  },
  logLevel: process.env.LOG_LEVEL || isDev ? 'debug' : 'error',
  zenUrl: `https://${process.env.ZEN_DOMAIN}.zendesk.com/api/v2/tickets.json`,
  zenToken: process.env.ZEN_TOKEN,
  zenEmail: process.env.ZEN_EMAIL,
  zenBrowser: process.env.ZEN_BROWSER,
  zenImpact: process.env.ZEN_IMPACT,
  zenService: process.env.ZEN_SERVICE,
  longDateFormat: 'D MMMM YYYY',
  mediumDateFormat: 'D MMM YYYY',
  trustProtoHeader: typeof process.env.DYNO !== 'undefined',
}
