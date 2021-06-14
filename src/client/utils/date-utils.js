import {
  endOfToday,
  format as formatFNS,
  differenceInCalendarDays,
  parseISO,
  isValid,
  parse,
} from 'date-fns'

export const DATE_FORMAT_LONG = 'yyyy-MM-dd'
export const DATE_FORMAT_SHORT = 'yyyy-MM'

const padZero = (value) => {
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    return value
  }
  return parsedValue < 10 ? `0${parsedValue}` : parsedValue.toString()
}

const normaliseAndFormatDate = (year, month, day) => {
  const y = padZero(year)
  const m = padZero(month)
  const yearAndMonth = `${padZero(y)}-${padZero(m)}`
  return day ? `${yearAndMonth}-${padZero(day)}` : yearAndMonth
}

export const format = (dateStr, dateFormat = 'dd MMM yyyy') => {
  return formatFNS(parseISO(dateStr), dateFormat)
}

export const today = () => {
  return formatFNS(new Date(), 'dd MMM yyyy')
}

export const formatWithTime = (dateTimeStr) => {
  return formatFNS(parseISO(dateTimeStr), 'd MMM yyyy, h:mmaaa')
}

export const isDateValid = (year, month, day, format = DATE_FORMAT_LONG) => {
  const date = normaliseAndFormatDate(year, month, day)
  return isValid(parse(date, format, new Date()))
}

export const isShortDateValid = (year, month) => {
  return isDateValid(year, month, null, DATE_FORMAT_SHORT)
}

export const transformValueForAPI = ({ year, month, day = 1 }) => {
  if (year && month && day) {
    return normaliseAndFormatDate(year, month, day)
  }

  return null
}

/**
 * Get the number of days to a given date as an integer.
 */
export const getDifferenceInDays = (dateIn) => {
  const today = endOfToday()
  return differenceInCalendarDays(new Date(dateIn), today)
}

/**
 * Get the number of days left or days ago that an input date is as a string.
 */
export const getDifferenceInDaysLabel = (dateIn) => {
  const difference = getDifferenceInDays(dateIn)
  return Math.abs(difference) === 1 ? difference + ' day' : difference + ' days'
}

export const getFinancialYearStart = (date) =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear()

export const generateFinancialYearLabel = (yearStart) =>
  `${yearStart}-${(yearStart + 1).toString().slice(-2)}`
