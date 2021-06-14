import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, isNumber } from 'lodash'
import { formatWithTime } from '../../../client/utils/date-utils'
import { isValid, parseISO } from 'date-fns'

import { CHANGE_TYPE_TEXT, TRUE, FALSE, NOT_SET } from '../constants'

import EditHistory from '../../../client/components/EditHistory/EditHistory'

function isDate(dateStr) {
  return isValid(parseISO(dateStr))
}

function getValue(value) {
  if (isBoolean(value)) {
    return value ? TRUE : FALSE
  }

  if (isNumber(value)) {
    // TODO: update with currency fields when confirmed (see CompanyEditHistory.jsx)
    return value.toString()
  }

  if (isDate(value)) {
    return formatWithTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = formatWithTime(timestamp)
  return `Updated on ${formattedTime} by ${changedBy}`
}

function InvestmentEditHistory({ dataEndpoint }) {
  return (
    <EditHistory
      dataEndpoint={dataEndpoint}
      changeType={CHANGE_TYPE_TEXT}
      getUpdatedBy={getUpdatedBy}
      getValue={getValue}
    />
  )
}

InvestmentEditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default InvestmentEditHistory
