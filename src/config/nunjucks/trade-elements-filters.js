/* global JSON:true */
const format = require('date-fns/format')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace)
}

/**
 * object used store the methods registered as a 'filter' (of the same name) within nunjucks
 * filter.foo("input") here, becomes {{ "input" | foo }} within nunjucks templates
 * @type {Object}
 */
const filter = {}

/**
 * logs an object in the template to the console on the client.
 * @param  {*} a any type
 * @return {String}   a script tag with a console.log call.
 * @example {{ "hello world" | log }}
 * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
 */
filter.log = function log(a) {
  return '<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>'
}

/**
 * Converts string to camel case
 * @param {String} s any string
 * @return {String} a string
 * @example {{ "Hello There" | toCamelCase }} // helloThere
 */
filter.toCamelCase = function toCamelCase(s) {
  return s
    .trim()
    .split(/-| /)
    .reduce(function (pw, cw, i) {
      pw += (i === 0 ? cw[0].toLowerCase() : cw[0].toUpperCase()) + cw.slice(1)
      return pw
    }, '')
}

/**
 * Hypthenates a string
 * @param {String} string to be converted
 * @return {String}
 * @example {{ "Hello there" | toHyphenated }} // hello-there
 */
filter.toHyphenated = function toHyphenated(string) {
  return string.trim().toLowerCase().replace(/\s+/g, '-')
}

filter.attributeArray = function attributeArray(list) {
  if (!Array.isArray(list)) {
    return filter.attributeObject(list)
  }

  let result = '['

  for (let iPos = 0; iPos < list.length - 1; iPos += 1) {
    result += '&#34;' + list[iPos] + '&#34;,'
  }

  result += '&#34;' + list[list.length - 1] + '&#34;]'

  return result
}

filter.versionAssetUrl = function (asset) {
  const env = process.env.NODE_ENV || 'develop'
  if (env === 'production') {
    const pos = asset.lastIndexOf('.')
    if (pos !== -1) {
      asset = asset.substr(0, pos) + '.min' + asset.substr(pos)
    }
  }

  return asset
}

filter.splitPart = function (value, seperator, part) {
  if (!value || value.length === 0) {
    return ''
  }

  const array = value.split('/')

  if (array && array.length < part) {
    return ''
  }

  return array[part]
}

// Accept dates in format dd/mm/yyyy or yyyy-mm-ddThh:MM:ss or yyyy-mm-dd
function getDateParts(value) {
  if (!value || value.length === 0) {
    return
  }

  if (typeof value === 'object') {
    value = format(value, 'dd/MM/YYYY')
  }

  const seperator = value.indexOf('-') !== -1 ? '-' : '/'
  if (value.indexOf('T') !== -1) {
    value = value.substr(0, value.indexOf('T'))
  }
  const parts = value.split(seperator)

  if (seperator === '/') {
    return parts
  }

  return [parts[2], parts[1], parts[0]]
}

filter.dateParseDay = function (value) {
  if (!value || value.length === 0) return
  const parts = getDateParts(value)
  if (!parts) return
  let day = parts[0]
  if (day.length < 2) day = `0${day}`
  return day
}

filter.dateParseMonth = function (value) {
  if (!value || value.length === 0) return
  const parts = getDateParts(value)
  if (!parts) return
  let month = parts[1]
  if (month.length < 2) month = `0${month}`
  return month
}

filter.dateParseYear = function (value) {
  if (!value || value.length === 0) return
  const parts = getDateParts(value)
  if (!parts) return
  return parts[2]
}

filter.attributeObject = function (myObject) {
  let result = '{'

  for (const key in myObject) {
    result += `&#34;${key}&#34;:&#34;${myObject[key]}&#34;,`
  }

  result = result.substr(0, result.length - 1) + '}'
  return result
}

filter.humanFieldName = function (fieldName) {
  fieldName = fieldName.toLocaleLowerCase()
  fieldName = capitalizeFirstLetter(fieldName)
  fieldName = replaceAll(fieldName, '_', ' ')
  return fieldName
}

function escapeRegExp(str) {
  if (str || str.length === 0) return str
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

filter.highlightTerm = function highlightTerm(phrase, term = '') {
  try {
    if (!phrase) phrase = ''
    if (phrase.length === 0 || term.length === 0) return phrase

    const cleanTerm = term.replace(/\*/g, '').replace(/\\/g, '\\\\')
    const regex = new RegExp(escapeRegExp(`(${cleanTerm})`), 'gi')
    return phrase.replace(regex, '<strong>$1</strong>')
  } catch (e) {
    return phrase
  }
}

/**
 * creates rearranges values and creates new date object
 * @param  {String} d   A date string (must be) formatted yyyy-mm-dd
 * @return {String}     a javascript date string
 */
filter.newDate = function (d) {
  const dateArr = d.split('-')
  return dateArr.length === 3
    ? new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2])
    : NaN
}

/**
 * returns a standard gov.uk date from an epoch using date-fns
 * date-fns documentation: https://date-fns.org
 * @method function
 * @param  {string} date date e.g 1462834800000
 * @param  {string} format date-fns format string (to override the default if needed)
 * @return {string} date string as per the current gov.uk standard 09/12/1981 -> 09 December 1981
 */
filter.date = function (date, format) {
  format = format || 'dd MMMM YYYY, h:mm:ss aaa'

  const formatted = format(date, format)

  if (formatted === 'Invalid date') {
    return ''
  }

  return formatted
}

filter.pluralise = function (number, string) {
  if (number !== 1) {
    string += 's'
  }

  return number + ' ' + string
}

filter.isArray = function (value) {
  return Array.isArray(value)
}

filter.keys = function (value) {
  return Object.keys(value)
}

filter.cellValue = function (value) {
  if (Array.isArray(value)) {
    let list = '<ul>'
    for (const item of value) {
      list += `<li>${item}</li>`
    }
    list += '</ul>'
    return list
  }

  return value
}

filter.hasValue = function (value) {
  return value !== null
}

filter.hasKey = function (value, key) {
  return value.hasOwnProperty(key) && value[key] !== null
}

module.exports = filter
