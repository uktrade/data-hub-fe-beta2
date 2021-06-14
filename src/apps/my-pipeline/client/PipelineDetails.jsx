import React from 'react'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import { STATUS_VALUES, LIKELIHOOD_VALUES } from './constants'
import urls from '../../../lib/urls'
import { SummaryTable } from '../../../client/components/'
import { WIDTHS } from '@govuk-react/constants/lib/spacing'
import { format } from '../../../client/utils/date-utils'
import { currencyGBP } from '../../../client/utils/number-utils'
import { format as formatFNS, parseISO } from 'date-fns'

function getLabels(acc, { value, label }) {
  acc[value] = label
  return acc
}

const STATUS_LABELS = STATUS_VALUES.reduce(getLabels, {})
const LIKELIHOOD_LABELS = Object.values(LIKELIHOOD_VALUES).reduce(getLabels, {})

const StyledSummaryTable = styled(SummaryTable)`
  width: ${WIDTHS['two-thirds']};
`

function Row(data) {
  if (!data) return null

  const [label, value, href] = data

  return (
    <SummaryTable.Row heading={label} key={label}>
      {href ? <Link href={href}>{value}</Link> : value}
    </SummaryTable.Row>
  )
}

export default function PipelineDetails({ item }) {
  const rows = [
    ['Project name', item.name],
    ['Company', item.company.name, urls.companies.detail(item.company.id)],
    ['Status', STATUS_LABELS[item.status]],
    item.likelihood_to_win && [
      'Export win potential',
      LIKELIHOOD_LABELS[item.likelihood_to_win],
    ],
    item.sector && ['Export sector', item.sector.segment],
    item.contact && [
      'Company contact',
      item.contact.name,
      urls.contacts.details(item.contact.id),
    ],
    item.potential_value && [
      'Potential export value',
      currencyGBP(item.potential_value),
    ],
    item.expected_win_date && [
      'Expected date for win',
      formatFNS(parseISO(item.expected_win_date), 'MMM y'),
    ],
    ['Created', format(item.created_on)],
    item.archived && ['Reason for archive', item.archived_reason],
    item.archived && ['Archived', format(item.archived_on)],
  ]

  return (
    <StyledSummaryTable caption="Project details">
      {rows.map(Row)}
    </StyledSummaryTable>
  )
}
