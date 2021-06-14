import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, isNumber } from 'lodash'
import { convertUsdToGbp } from '../../../../../common/currency'

import EditHistory from '../../../../../client/components/EditHistory/EditHistory'
import { formatWithTime } from '../../../../../client/utils/date-utils'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import { isValid, parseISO } from 'date-fns'

import {
  ARCHIVED,
  NOT_ARCHIVED,
  YES,
  NO,
  AUTOMATIC_UPDATE,
  CHANGE_TYPE_TEXT,
  NOT_SET,
} from '../constants'

const CURRENCY_FIELDS = ['Turnover']

function isDate(dateStr) {
  return isValid(parseISO(dateStr))
}

function getValueFromBoolean(value, field) {
  if (
    field === 'Is number of employees estimated' ||
    field === 'Is turnover estimated'
  ) {
    return value ? YES : NO
  }

  if (field === 'Archived') {
    return value ? ARCHIVED : NOT_ARCHIVED
  }
}

function getValue(value, field) {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isNumber(value)) {
    return CURRENCY_FIELDS.includes(field)
      ? currencyGBP(convertUsdToGbp(value), {
          maximumSignificantDigits: 2,
        })
      : value.toString()
  }

  if (isDate(value)) {
    return formatWithTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = formatWithTime(timestamp)
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

function CompanyEditHistory({ dataEndpoint }) {
  return (
    <EditHistory
      dataEndpoint={dataEndpoint}
      changeType={CHANGE_TYPE_TEXT}
      getUpdatedBy={getUpdatedBy}
      getValue={getValue}
    />
  )
}

CompanyEditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default CompanyEditHistory
