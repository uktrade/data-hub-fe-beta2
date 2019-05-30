/* eslint-disable camelcase */
const {
  filter,
  keyBy,
  snakeCase,
  upperFirst,
} = require('lodash')
const { isValid, format, parse } = require('date-fns')

const { hqLabels } = require('./companies/labels')

function transformObjectToOption ({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformHQCodeToLabelledOption ({ id, name }) {
  switch (name) {
    case 'ehq':
      return {
        value: id,
        label: hqLabels.ehq,
      }
    case 'ghq':
      return {
        value: id,
        label: hqLabels.ghq,
      }
    case 'ukhq':
      return {
        value: id,
        label: hqLabels.ukhq,
      }
  }
}

function transformStringToOption (string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption ({ id, first_name, last_name, job_title, email }) {
  return {
    value: id,
    label: upperFirst(filter([`${first_name} ${last_name}`, job_title]).join(', ')),
  }
}

function transformIdToObject (id) {
  return {
    id,
  }
}

function transformDateObjectToDateString (key) {
  if (!key) {
    throw Error('date object key is required to transform date')
  }
  return function transformDateObjectToStringWithKey (props = {}) {
    const dateString = ['year', 'month', 'day']
      .map(x => props[`${key}_${x}`])
      .join('-')

    return dateString === '--' ? null : dateString
  }
}

function transformDateStringToDateObject (dateString) {
  const isValidDate = dateString && isValid(parse(dateString))

  return {
    year: isValidDate ? format(dateString, 'YYYY') : '',
    month: isValidDate ? format(dateString, 'MM') : '',
    day: isValidDate ? format(dateString, 'DD') : '',
  }
}

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj (collection) {
  return keyBy(collection, (elem) => {
    return snakeCase(elem.label)
  })
}

module.exports = {
  buildMetaDataObj,
  transformHQCodeToLabelledOption,
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
  transformIdToObject,
  transformDateObjectToDateString,
  transformDateStringToDateObject,
}
