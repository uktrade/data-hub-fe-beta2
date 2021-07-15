/* eslint-disable camelcase */
const { filter, keyBy, snakeCase, upperFirst } = require('lodash')
const { formatDate, isDateValid } = require('../common/date')

const { hqLabels } = require('./companies/labels')

function transformObjectToOption({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformObjectToGovUKOption({ id, name }) {
  return {
    value: id,
    text: name,
  }
}

function transformHQCodeToLabelledOption({ id, name }) {
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

function transformStringToOption(string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption({ id, first_name, last_name, job_title }) {
  return {
    value: id,
    label: upperFirst(
      filter([`${first_name} ${last_name}`, job_title]).join(', ')
    ),
  }
}

function transformCountryToOptionWithIsoCode({ id, name, iso_alpha2_code }) {
  return {
    key: id,
    label: name,
    value: iso_alpha2_code,
  }
}

function transformIdToObject(id) {
  return {
    id,
  }
}

function transformDateObjectToDateString(key) {
  if (!key) {
    throw Error('date object key is required to transform date')
  }
  return function transformDateObjectToStringWithKey(props = {}) {
    const dateString = ['year', 'month', 'day']
      .map((x) => props[`${key}_${x}`])
      .join('-')

    return dateString === '--' ? null : dateString
  }
}

function transformDateStringToDateObject(dateString) {
  const isValidDate = dateString && isDateValid(dateString)

  return {
    year: isValidDate ? formatDate(dateString, 'yyyy') : '',
    month: isValidDate ? formatDate(dateString, 'MM') : '',
    day: isValidDate ? formatDate(dateString, 'dd') : '',
  }
}

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj(collection) {
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
  transformCountryToOptionWithIsoCode,
  transformIdToObject,
  transformDateObjectToDateString,
  transformDateStringToDateObject,
  transformObjectToGovUKOption,
}
