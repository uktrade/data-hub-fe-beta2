const {
  format,
  formatDistanceToNowStrict,
  isValid,
  parseISO,
  subMonths,
  endOfYesterday,
  addMonths: addMonthsFNS,
  subDays,
  subWeeks,
} = require('date-fns')
const {
  DATE_LONG_FORMAT,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  INTERACTION_TIMESTAMP_FORMAT,
} = require('./constants')

function isDateValid(date) {
  return isValid(parseISO(date))
}

function isUnparsedDateValid(date) {
  return isValid(date)
}

function formatDate(date, dateFormat) {
  return isDateValid(date) ? format(parseISO(date), dateFormat) : null
}

function formatLongDate(dateString) {
  return formatDate(dateString, DATE_LONG_FORMAT)
}

function formatMediumDate(dateString) {
  return formatDate(dateString, DATE_MEDIUM_FORMAT)
}

function formatMediumDateTime(dateString) {
  return formatDate(dateString, DATE_TIME_MEDIUM_FORMAT)
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

  return formatDate(date, INTERACTION_TIMESTAMP_FORMAT)
}

const parseAndFormatDate = (dateStr) => {
  return {
    day: parseInt(format(new Date(dateStr), 'd')),
    month: parseInt(format(new Date(dateStr), 'M')),
    year: parseInt(format(new Date(dateStr), 'yyyy')),
  }
}

function getDifferenceInWords(date, suffix = true) {
  const formattedDate = formatDistanceToNowStrict(parseISO(date), {
    addSuffix: suffix,
  })
  if (formattedDate == '1 day ago') {
    return 'a day ago'
  } else {
    return formattedDate
  }
}

function getYesterday() {
  return endOfYesterday()
}

function subtractMonths(date, numberOfMonths) {
  return subMonths(date, numberOfMonths)
}

function addMonths(date, numberOfMonths) {
  return addMonthsFNS(date, numberOfMonths)
}

function subtractDays(date, numberOfDays) {
  return subDays(date, numberOfDays)
}

function subtractWeeks(date, numberOfweeks) {
  return subWeeks(date, numberOfweeks)
}

module.exports = {
  formatDate,
  formatLongDate,
  formatMediumDate,
  formatMediumDateTime,
  isDateValid,
  parseDateString,
  transformValueForApi,
  getInteractionTimestamp,
  parseAndFormatDate,
  getDifferenceInWords,
  getYesterday,
  subtractMonths,
  addMonths,
  subtractDays,
  subtractWeeks,
  isUnparsedDateValid,
}
