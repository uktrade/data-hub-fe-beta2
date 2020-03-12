import axios from 'axios'
import { DateUtils, NumberUtils } from 'data-hub-components'
import { GREEN, BLUE } from 'govuk-colours'

import { NOT_IMPLEMENTED } from './state'

function getBadges(win) {
  const badges = []

  if (win.hvc?.code) {
    badges.push({
      text: 'HVC',
      borderColour: BLUE,
    })
  }

  if (win.response?.confirmed) {
    badges.push({
      text: 'Confirmed',
      borderColour: GREEN,
    })
  }

  return badges
}

function getMetadata(win) {
  const { contact, officer } = win
  const metadata = [
    [
      'Lead officer',
      `${officer.name} (${officer.team.type} ${officer.team.sub_type})`,
    ],
    [
      'Company contact',
      `${contact.name} (${contact.job_title} - ${contact.email})`,
    ],
    ['Customer', win.customer],
    ['Type of export', win.business_type],
    [
      'Total export value',
      NumberUtils.currencyGBP(win.value.export.total, {
        maximumSignificantDigits: 3,
      }),
    ],
    ['Type of win', win.name_of_export],
    ['Country exported to', win.country],
    ['Sector', win.sector],
    ['Company type', win.business_potential],
  ]

  if (win.response.confirmed) {
    metadata.push([
      'Date confirmed',
      DateUtils.formatWithTime(win.response.date),
    ])
  }

  if (win.hvc) {
    metadata.push(['HVC name', `${win.hvc.code}: ${win.hvc.name}`])
  }

  return metadata.map(([label, value]) => ({ label, value }))
}

export function fetchExportWins({ companyId, activePage }) {
  const offset = activePage * 10 - 10
  const param = offset ? '?offset=' + offset : ''

  return axios
    .get(`/api-proxy/v4/company/${companyId}/export-win${param}`)
    .catch((e) => {
      // @TODO: Remove the 404 and handle separatly once API is in place to return a 501
      if (e.response?.status === 501 || e.response?.status == 404) {
        return { [NOT_IMPLEMENTED]: true }
      }

      return Promise.reject(new Error(e.message))
    })
    .then((response) => {
      if (response[NOT_IMPLEMENTED]) {
        return response
      }

      const { data } = response
      return {
        count: data.count,
        results: data.results.map((win) => ({
          badges: getBadges(win),
          headingText: win.title,
          subheading: `Won on ${DateUtils.formatWithTime(win.date)}`,
          metadata: getMetadata(win),
        })),
      }
    })
}
