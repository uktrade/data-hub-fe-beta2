// https://www.bloomberg.com/quote/USDGBP:CUR
const EXCHANGE_RATE_USD_TO_GBP = 0.7189
const EXCHANGE_RATE_GBP_TO_USD = parseFloat(
  Number(1 / EXCHANGE_RATE_USD_TO_GBP).toFixed(4)
)

const DATE_LONG_FORMAT = 'd MMMM yyyy'
const DATE_DAY_LONG_FORMAT = 'E, dd MMM yyyy'
const DATE_MEDIUM_FORMAT = 'd mmm yyyy'
const DATE_TIME_MEDIUM_FORMAT = 'd MMM yyyy, h:mmaaa'

const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary,',
}

module.exports = {
  EXCHANGE_RATE_USD_TO_GBP,
  EXCHANGE_RATE_GBP_TO_USD,
  DATE_DAY_LONG_FORMAT,
  DATE_LONG_FORMAT,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  VARIANTS,
}
