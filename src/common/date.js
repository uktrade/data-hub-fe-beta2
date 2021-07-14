const { format, subMonths } = require('date-fns')
const {
  DATE_LONG_FORMAT,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  INTERACTION_TIMESTAMP_FORMAT,
} = require('./constants')

function formatLongDate(dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), DATE_LONG_FORMAT)
  }

  return null
}

function formatMediumDate(dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), DATE_MEDIUM_FORMAT)
  }

  return null
}

function formatMediumDateTime(dateString) {
  if (dateString) {
    return format(parseDateString(dateString), DATE_TIME_MEDIUM_FORMAT)
  }
}

function parseDateString(dateString) {
  if (dateString.indexOf('/') !== -1) {
    const parts = dateString.split('/')
    return new Date(parts[2], parts[1] - 1, parts[0])
  } else {
    const date = new Date(dateString)
    if (date.toString() !== 'Invalid Date') {
      return date
    }
  }
  return null
}

function padZero(value) {
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    return value
  }
  return parsedValue < 10 ? `0${parsedValue}` : parsedValue.toString()
}

function transformValueForApi({ year, month, day = 1 }) {
  if (year && month && day) {
    const y = padZero(year)
    const m = padZero(month)
    const yearAndMonth = `${y}-${m}`
    return day ? `${yearAndMonth}-${padZero(day)}` : yearAndMonth
  }
  return null
}

function getInteractionTimestamp({ offset }) {
  const date = new Date()

  if (offset > 0) {
    subMonths(date, offset)
  }

  return format(date, INTERACTION_TIMESTAMP_FORMAT)
}

module.exports = {
  formatLongDate,
  formatMediumDate,
  formatMediumDateTime,
  parseDateString,
  transformValueForApi,
  getInteractionTimestamp,
}
