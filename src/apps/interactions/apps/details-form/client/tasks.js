import axios from 'axios'
import { omit, pick } from 'lodash'

import urls from '../../../../../lib/urls'
import { catchApiError } from '../../../../../client/components/Task/utils'
import getContactFromQuery from '../../../../../client/utils/getContactFromQuery'
import { INTERACTION_STATUS } from '../../../constants'
import { EXPORT_INTEREST_STATUS_VALUES, OPTION_NO } from '../../../../constants'
import { ID as STORE_ID } from './state'
import { transformValueForApi } from '../../../../../common/date'

const FIELDS_TO_OMIT = [
  'currently_exporting',
  'future_interest',
  'not_interested',
  'service_2nd_level',
]

function transformOption(option) {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

function transformArrayOfOptions(options) {
  if (!options || !options.length) {
    return []
  }
  return options.map(transformOption)
}

function transformExportCountries(values) {
  if (values.were_countries_discussed === OPTION_NO) {
    return
  }
  return EXPORT_INTEREST_STATUS_VALUES.filter(
    (status) => values[status]
  ).reduce(
    (acc, status) => [
      ...acc,
      ...values[status].map((country) => ({
        country: transformOption(country),
        status,
      })),
    ],
    []
  )
}

function transformServiceAnswers(values) {
  return Object.keys(values)
    .filter((fieldName) => fieldName.startsWith('service_answers.'))
    .reduce((acc, fieldName) => {
      const [, questionId] = fieldName.split('.')
      return {
        ...acc,
        [questionId]: {
          [values[`service_answers.${questionId}`]]: {},
        },
      }
    }, {})
}

export function openContactForm({ values, currentStep, url }) {
  window.sessionStorage.setItem(
    STORE_ID,
    JSON.stringify({
      values,
      currentStep,
    })
  )
  window.location.href = url
}

export function restoreState() {
  const stateFromStorage = window.sessionStorage.getItem(STORE_ID)

  if (!stateFromStorage) {
    return {}
  }

  const queryContact = getContactFromQuery()
  if (queryContact.label && queryContact.value) {
    const updatedState = JSON.parse(stateFromStorage)
    updatedState.values.contacts.push({
      label: queryContact.label,
      value: queryContact.value,
    })
    return updatedState
  }

  return JSON.parse(stateFromStorage)
}

export function saveInteraction({ values, companyId, referralId }) {
  window.sessionStorage.removeItem(STORE_ID)

  const endpoint = referralId
    ? `/api-proxy/v4/company-referral/${referralId}/complete`
    : `/api-proxy/v4/interaction`

  const request = values.id ? axios.patch : axios.post

  const commonPayload = {
    status: INTERACTION_STATUS.COMPLETE,
    company: {
      id: companyId,
    },
    service: values.service_2nd_level || values.service,
    service_answers: transformServiceAnswers(values),
    contacts: transformArrayOfOptions(values.contacts),
    dit_participants: values.dit_participants.map((a) => ({
      adviser: a.value,
    })),
    date: transformValueForApi(values.date),
    policy_areas: transformArrayOfOptions(values.policy_areas),
    communication_channel: transformOption(values.communication_channel),
    event: transformOption(values.event),
    // Cannot be empty string
    grant_amount_offered:
      'grant_amount_offered' in values
        ? values.grant_amount_offered || null
        : undefined,
    ...pick(values, [
      'notes',
      'subject',
      'net_company_receipt',
      'policy_feedback_notes',
      'was_policy_feedback_provided',
      'is_event',
      'service_delivery_status',
      'policy_issue_types',
      'has_related_trade_agreements',
    ]),
    related_trade_agreements: transformArrayOfOptions(
      values.related_trade_agreements
    ),
  }

  const payload = values.id
    ? {
        ...commonPayload,
      }
    : {
        ...values,
        ...commonPayload,
        export_countries: transformExportCountries(values),
      }

  return request(
    values.id ? `${endpoint}/${values.id}` : endpoint,
    omit(payload, FIELDS_TO_OMIT)
  ).catch(catchApiError)
}

export const fetchActiveEvents = () =>
  axios
    .get(urls.interactions.activeEventsData())
    .catch(catchApiError)
    .then(({ data }) => data)
