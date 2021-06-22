import Joi from '@hapi/joi'

export const email = (x) =>
  Joi.string().email({ tlds: false }).validate(x).error &&
  'Enter a valid email address'
