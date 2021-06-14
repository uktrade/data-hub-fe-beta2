const nunjucks = require('nunjucks')
const {
  toDate,
  parseISO,
  isValid,
  format: dateFnsFormat,
  formatDistanceToNowStrict,
  minutesToHours,
} = require('date-fns')
const Case = require('case')
const numeral = require('numeral')
const queryString = require('qs')
const { newlineToBr } = require('../../lib/text-formatting')
const { joinPaths } = require('../../lib/path')
const {
  assign,
  castArray,
  compact,
  concat,
  escape,
  isArray,
  isFunction,
  isPlainObject,
  isBoolean,
  isInteger,
  isEmpty,
  isNull,
  isString,
  pickBy,
  filter,
  reject,
  isNil,
  keys,
  forEach,
  values,
  flatten,
  map,
  mapValues,
  omit,
  pick,
  lowerCase,
  kebabCase,
  camelCase,
} = require('lodash')
require('numeral/locales/en-gb')
const {
  DATE_LONG_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
} = require('../../common/constants')

numeral.locale('en-gb')

const { currencyFormat } = require('../')

function isNotEmpty(value) {
  return (
    !isNil(value) &&
    !/^\s*$/.test(value) &&
    !(isPlainObject(value) && isEmpty(value))
  )
}

function pluralise(string, count, pluralisedWord) {
  if (parseInt(count, 10) !== 1) {
    if (pluralisedWord) {
      string = pluralisedWord
    } else if (string.match(/[^aeiou]y$/)) {
      string = string.replace(/y$/, 'ies')
    } else {
      string += 's'
    }
  }

  return string
}

const filters = {
  lowerCase,
  kebabCase,
  camelCase,
  assign,
  castArray,
  concat,
  filter,
  reject,
  values,
  keys,
  flatten,
  map,
  omit,
  pick,
  mapValues,
  isArray,
  isFunction,
  isNull,
  isPlainObject,
  isString,
  pluralise,
  joinPaths,
  sentenceCase: Case.sentence,

  escapeHtml(contents) {
    return newlineToBr(escape(contents))
  },

  reverseDate(dateString) {
    if (isNil(dateString)) {
      return
    }
    return dateString.split('/').reverse().join('/')
  },

  encodeQueryString(value) {
    return encodeURIComponent(queryString.stringify(value))
  },

  assignCopy(...args) {
    return assign({}, ...args)
  },

  split(value, separator) {
    if (!isString(value)) {
      return value
    }

    return value.split(separator)
  },

  highlight(searchResultText, searchTerm, matchFullWord = false) {
    if (
      !isString(searchResultText) ||
      !isString(searchTerm) ||
      !searchTerm.trim()
    ) {
      return searchResultText
    }

    try {
      // Remove regex characters from the search term
      // as they wont be in the result and will cause an error in the regular expression
      const cleanedSearchTerm = searchTerm.replace(/[.*+?^${}()<&|[\]\\]/g, '')
      const searchPattern = matchFullWord
        ? new RegExp(`\\b(${cleanedSearchTerm})\\b`, 'gi')
        : new RegExp(`(${cleanedSearchTerm})`, 'gi')

      const result = escape(searchResultText).replace(
        searchPattern,
        '<span class="u-highlight">$1</span>'
      )
      return new nunjucks.runtime.SafeString(result)
    } catch (error) {
      return searchResultText
    }
  },

  collectionDefault: (collection, defaultValue = 'Not found') => {
    const hasPresentableValue = (element) => {
      return !isEmpty(element) || isBoolean(element) || isInteger(element)
    }

    if (isArray(collection)) {
      return collection.slice().map((element) => {
        return !hasPresentableValue(element) ? defaultValue : element
      })
    }
    if (isPlainObject(collection)) {
      const obj = assign({}, collection)

      forEach(keys(obj), (key) => {
        if (!hasPresentableValue(obj[key])) {
          obj[key] = defaultValue
        }
      })

      return obj
    }
  },

  removeNilAndEmpty: (collection) => {
    if (isArray(collection)) {
      return collection.filter(isNotEmpty)
    }
    if (isPlainObject(collection)) {
      return pickBy(collection, isNotEmpty)
    }
    return collection
  },

  formatCurrency: (value, format = currencyFormat) => {
    return numeral(value).format(format)
  },

  formatNumber: (number, locales = 'en-GB') => {
    return number.toLocaleString(locales)
  },

  formatDate: (value, format = DATE_LONG_FORMAT) => {
    if (!value) {
      return value
    }

    if (!isValid(new Date(value))) {
      return value
    }

    return dateFnsFormat(new Date(value), format)
  },

  formatDateTime: (value, format = DATE_TIME_MEDIUM_FORMAT) => {
    if (!value) {
      return value
    }

    const parsedDate = toDate(parseISO(value))

    if (!isValid(parsedDate)) {
      return value
    }

    return dateFnsFormat(parsedDate, format)
      .replace('AM', 'am')
      .replace('PM', 'pm')
  },

  formatAddress: (address, join = ', ', isAddressAreaEnabled = false) => {
    if (!address) {
      return
    }

    return compact([
      address.line_1,
      address.line_2,
      address.town,
      address.county,
      address.postcode,
      address.area && isAddressAreaEnabled ? address.area.name : null,
      address.country.name,
    ]).join(join)
  },

  humanizeDuration: (value, measurement = 'minutes') => {
    let asHours = value
    if (measurement == 'minutes') {
      asHours = minutesToHours(value)
    }
    const hoursSuffix = pluralise('hour', asHours)
    return asHours + ' ' + hoursSuffix
  },

  fromNow: (value) => {
    return formatDistanceToNowStrict(parseISO(value))
  },

  arrayToLabelValues: (items) => {
    const result = []
    for (const item of items) {
      result.push({
        label: item,
        value: item,
      })
    }
    return result
  },

  applyClassModifiers(className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) {
      return className
    }

    const classModifier = flatten([modifier])
      .filter(isNotEmpty)
      .map((mod) => `${className}--${mod}`)
      .join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
