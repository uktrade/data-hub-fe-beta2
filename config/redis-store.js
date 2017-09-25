const Redis = require('ioredis')
const redisCrypto = require('connect-redis-crypto')
const session = require('express-session')
const url = require('url')

const logger = require('./logger')
const config = require('./')

const RedisStore = redisCrypto(session)

let redisConfig = {
  port: config.redis.port,
  host: config.redis.host,
}

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url)
  if (config.redis.sentinel) {
    redisConfig = {
      sentinels: [
        {
          host: redisURL.hostname || config.redis.host,
          port: redisURL.port || config.redis.sentinelPort,
        },
      ],
      name: config.redis.sentinelMaster,
    }
  } else {
    redisConfig = {
      port: redisURL.port || config.redis.port,
      host: redisURL.hostname || config.redis.host,
    }
  }
  if (redisURL.auth) {
    redisConfig.password = redisURL.auth.split(':')[1]
  }
}
if (config.redis.useTLS) {
  redisConfig.tls = {
    // allows self-signed certificates
    rejectUnauthorized: false,
  }
}

const client = new Redis(redisConfig)

client.on('error', (e) => {
  logger.log('error', 'Error connecting to redis')
  logger.log('error', e)
  throw e
})

client.on('connect', () => {
  logger.log('info', 'connected to redis')
})

client.on('ready', () => {
  logger.log('info', 'connection to redis is ready to use')
})

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
})

module.exports = redisStore
