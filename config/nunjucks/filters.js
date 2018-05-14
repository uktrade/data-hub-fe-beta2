const nunjucks = require('nunjucks')
const moment = require('moment')
require('moment-duration-format')
const dateFns = require('date-fns')
const Case = require('case')
const numeral = require('numeral')
const queryString = require('qs')
const {
  assign,
  castArray,
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
} = require('lodash')
require('numeral/locales/en-gb')

numeral.locale('en-gb')

const { longDateFormat, mediumDateTimeFormat, currencyFormat } = require('../../config')

function isNotEmpty (value) {
  return !isNil(value) && !/^\s*$/.test(value) && !(isPlainObject(value) && isEmpty(value))
}

function pluralise (string, count, pluralisedWord) {
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
  sentenceCase: Case.sentence,

  encodeQueryString (value) {
    return encodeURIComponent(queryString.stringify(value))
  },

  assignCopy (...args) {
    return assign({}, ...args)
  },

  split (value, separator) {
    if (!isString(value)) { return value }

    return value.split(separator)
  },

  highlight (searchResultText, searchTerm, matchFullWord = false) {
    if (!isString(searchResultText) || !isString(searchTerm) || !searchTerm.trim()) {
      return searchResultText
    }

    try {
      // Remove regex characters from the search term
      // as they wont be in the result and will cause an error in the regular expression
      const cleanedSearchTerm = searchTerm.replace(/[.*+?^${}()<&|[\]\\]/g, '')
      const searchPattern = matchFullWord
        ? new RegExp(`\\b(${cleanedSearchTerm})\\b`, 'gi')
        : new RegExp(`(${cleanedSearchTerm})`, 'gi')

      const result = escape(searchResultText).replace(searchPattern, '<span class="u-highlight">$1</span>')
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

  formatDate: (value, format = longDateFormat) => {
    if (!value) {
      return value
    }
    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }
    return dateFns.format(parsedDate, format)
  },

  formatDateTime: (value, format = mediumDateTimeFormat) => {
    if (!value) {
      return value
    }

    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }

    return dateFns.format(parsedDate, format)
  },

  humanizeDuration: (value, measurement = 'minutes') => {
    const duration = moment.duration(value, measurement)
    const hoursSuffix = pluralise('hour', duration.asHours())

    return duration.format(`h [${hoursSuffix}]`)
  },

  formatDuration: (value, format = 'hh:mm', measurement = 'minutes') => {
    return moment.duration(value, measurement).format(format, { trim: false })
  },

  fromNow: (value) => {
    return moment(value).fromNow()
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

  applyClassModifiers (className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) { return className }

    const classModifier = flatten([modifier]).filter(isNotEmpty).map(mod => `${className}--${mod}`).join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
