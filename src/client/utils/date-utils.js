import {
  endOfToday,
  format as formatFNS,
  differenceInCalendarDays,
  parseISO,
  isValid,
  parse,
  subDays,
  isAfter,
  addYears as addYearsFNS,
  subYears,
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

export const isDateValid = (date) => {
  return isValid(parseISO(date))
}

export const format = (dateStr, dateFormat = 'dd MMM yyyy') =>
  isDateValid(dateStr) ? formatFNS(parseISO(dateStr), dateFormat) : null

export const today = () => {
  return format(new Date())
}

export const formatWithTime = (dateTimeStr) => {
  return format(dateTimeStr, 'd MMM yyyy, h:mmaaa')
}

export const isNormalisedDateValid = (
  year,
  month,
  day,
  format = DATE_FORMAT_LONG
) => {
  const date = normaliseAndFormatDate(year, month, day)
  return isValid(parse(date, format, new Date()))
}

export const isShortDateValid = (year, month) => {
  return isNormalisedDateValid(year, month, null, DATE_FORMAT_SHORT)
}

export const transformValueForAPI = ({ year, month, day = 1 }) => {
  if (year && month && day) {
    return normaliseAndFormatDate(year, month, day)
  }

  return null
}

export const createExpectedWinDateForPipeline = (date) => {
  return parse(date, 'yyyy-MM-dd', new Date())
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

export const isDNBChangeRequestValid = (date) => {
  const todaysDate = today()
  const timeInterval = subDays(todaysDate, 20)
  return isAfter(date, timeInterval)
}

export const addYears = (date, yearsToAdd) => {
  return addYearsFNS(date, yearsToAdd)
}

export const subtractYears = (date, yearsToAdd) => {
  return subYears(date, yearsToAdd)
}
