import _ from 'lodash'
import qs from 'qs'
import React from 'react'
import { connect } from 'react-redux'
import { H3 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import { GREY_1 } from 'govuk-colours'
import styled from 'styled-components'

import { SPACING_POINTS } from '@govuk-react/constants'

import {
  AdviserTypeAhead,
  NewWindowLink,
  FieldCheckboxes,
  FieldDate,
  FieldHelp,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTextarea,
  FieldTypeahead,
} from '../../../../../client/components'

import { useFormContext } from '../../../../../client/components/Form/hooks'

import {
  SERVICE_CONTEXTS,
  SERVICE_DELIVERY_STATUS_COMPLETED,
  THEMES,
  KINDS,
} from '../../../constants'

import {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../constants'

import { ADD_INTERACTION__GET_ACTIVE_EVENTS } from '../../../../../client/actions'
import { ID, TASK_GET_ACTIVE_EVENTS } from './state'
import { TaskStatus } from '../../../../../client/components/Task'

import urls from '../../../../../lib/urls'

const StyledSubservicePrefix = styled.div`
  background: ${GREY_1};
  height: ${SPACING_POINTS[4]}px;
  position: relative;
  width: 3px;
  margin-right: ${SPACING_POINTS[8]}px;
  &:after {
    background: ${GREY_1};
    content: '';
    height: 3px;
    left: 0;
    position: absolute;
    top: ${SPACING_POINTS[4]}px;
    width: ${SPACING_POINTS[6]}px;
  }
`

const StyledSubserviceWrapper = styled.div`
  margin: ${SPACING_POINTS[3]}px 0 0 ${SPACING_POINTS[3]}px;
  display: flex;
  align-items: end;
`

const StyledSubserviceField = styled(FieldSelect)`
  width: 100%;
`

const getServiceContext = (theme, kind, investmentProject) => {
  if (investmentProject) {
    return SERVICE_CONTEXTS.INVESTMENT_PROJECT_INTERACTION
  }

  const mapping = {
    [THEMES.EXPORT]: {
      [KINDS.INTERACTION]: SERVICE_CONTEXTS.EXPORT_INTERACTION,
      [KINDS.SERVICE_DELIVERY]: SERVICE_CONTEXTS.EXPORT_SERVICE_DELIVERY,
    },
    [THEMES.INVESTMENT]: SERVICE_CONTEXTS.INVESTMENT_INTERACTION,
    [THEMES.OTHER]: {
      [KINDS.INTERACTION]: SERVICE_CONTEXTS.OTHER_INTERACTION,
      [KINDS.SERVICE_DELIVERY]: SERVICE_CONTEXTS.OTHER_SERVICE_DELIVERY,
    },
  }

  return kind && mapping[theme][kind] ? mapping[theme][kind] : mapping[theme]
}

const isTapService = (service) => service?.label?.includes('(TAP)')

const buildServicesHierarchy = (services) =>
  Object.values(
    services.reduce((acc, s) => {
      const [parentLabel, childLabel] = s.label.split(' : ')
      const parent =
        parentLabel in acc
          ? acc[parentLabel]
          : {
              label: parentLabel,
              value: childLabel ? parentLabel : s.value,
              children: [],
            }

      if (childLabel) {
        parent.children.push({
          label: childLabel,
          value: s.value,
        })
      }

      return {
        ...acc,
        [parentLabel]: parent,
      }
    }, {})
  ).map((s) => ({
    ...s,
    children: s.children.length ? (
      <StyledSubserviceWrapper>
        <StyledSubservicePrefix />
        <StyledSubserviceField
          name="service_2nd_level"
          emptyOption="-- Select service --"
          options={s.children}
          required="Select a service"
          aria-label="service second level"
        />
      </StyledSubserviceWrapper>
    ) : null,
  }))

const validateRequiredCountries = (countries, field, { values }) =>
  !EXPORT_INTEREST_STATUS_VALUES.some((status) => values[status])
    ? 'Select at least one country in one of the three fields'
    : null

const validatedDuplicatedCountries = (countries, field, { values }) =>
  EXPORT_INTEREST_STATUS_VALUES.filter((status) => status !== field.name).some(
    (status) =>
      countries &&
      values[status] &&
      countries.some((country) => values[status].includes(country))
  )
    ? 'A country that was discussed cannot be entered in multiple fields'
    : null

const StepInteractionDetails = ({
  companyId,
  contacts,
  services,
  serviceDeliveryStatuses,
  policyAreas,
  policyIssueTypes,
  communicationChannels,
  countries,
  onOpenContactForm,
  activeEvents,
  activeEvent,
}) => {
  const { values = {} } = useFormContext()
  const serviceContext = getServiceContext(
    values.theme,
    values.kind,
    values.investment_project
  )
  const servicesHierarchy = buildServicesHierarchy(
    services.filter((s) => s.contexts.includes(serviceContext))
  )

  const selectedServiceId = values.service_2nd_level || values.service
  const selectedService = services.find((s) => s.value === selectedServiceId)
  const isServiceDelivery = values.kind === KINDS.SERVICE_DELIVERY

  const helpUrl = (position) =>
    urls.external.policyFeedbackHelp +
    '?' +
    qs.stringify({
      ..._.pick(values, ['theme', 'kind']),
      'link-pos': 'box-' + position,
    })

  return (
    <>
      <H3 as="h2">Service</H3>

      <InsetText>
        If your contact provided business intelligence (eg issues impacting the
        company or feedback on government policy), complete the business
        intelligence section.
        <br />
        <br />
        <NewWindowLink href={helpUrl(1)}>See more guidance</NewWindowLink>
      </InsetText>

      <FieldSelect
        name="service"
        emptyOption="-- Select service --"
        options={servicesHierarchy}
        required="Select a service"
        aria-label="service"
      />

      {selectedService?.interaction_questions?.map((question) => (
        <FieldRadios
          name={`service_answers.${question.id}`}
          legend={question.name}
          required={`Give answer to "${question.name}"`}
          options={question.answer_options.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
        />
      ))}

      {isServiceDelivery && isTapService(selectedService) && (
        <>
          <FieldSelect
            label="Service status (optional)"
            name="service_delivery_status"
            emptyOption="-- Select service status --"
            options={serviceDeliveryStatuses}
          />
          <FieldInput
            type="number"
            label="Grant offered (optional)"
            name="grant_amount_offered"
          />
          {values.service_delivery_status ===
            SERVICE_DELIVERY_STATUS_COMPLETED && (
            <FieldInput
              type="text"
              label="Net receipt (optional)"
              name="net_company_receipt"
            />
          )}
        </>
      )}

      <H3 as="h2">Participants</H3>

      <FieldTypeahead
        name="contacts"
        label="Contact(s)"
        placeholder="-- Select contact --"
        required="Select at least one contact"
        options={contacts}
        isMulti={true}
        hint={
          <>
            If the contact you are looking for is not listed you can{' '}
            <Link
              onClick={onOpenContactForm}
              href={urls.contacts.create(companyId, {
                origin_url: window.location.pathname,
                origin_type: 'interaction',
              })}
            >
              add a new contact
            </Link>
            .
          </>
        }
      />

      <AdviserTypeAhead
        name="dit_participants"
        label="Adviser(s)"
        required="Select at least one adviser"
        isMulti={true}
      />

      <H3 as="h2">Details</H3>

      <FieldDate
        name="date"
        label="Date of interaction"
        required="Enter a valid date"
      />

      {!isServiceDelivery && (
        <FieldTypeahead
          name="communication_channel"
          label="Communication channel"
          options={communicationChannels}
          placeholder="-- Select communication channel --"
          required="Select a communication channel"
        />
      )}

      {isServiceDelivery && (
        <>
          <FieldRadios
            inline={true}
            name="is_event"
            legend="Is this an event?"
            options={OPTIONS_YES_NO}
            required="Answer if this was an event"
          />
          {values.is_event === OPTION_YES && (
            <TaskStatus
              id={ID}
              name={TASK_GET_ACTIVE_EVENTS}
              startOnRender={{
                onSuccessDispatch: ADD_INTERACTION__GET_ACTIVE_EVENTS,
              }}
            >
              {() => (
                <FieldTypeahead
                  label="Event"
                  name="event"
                  placeholder="-- Select event --"
                  required="Select a specific event"
                  initialValue={activeEvent}
                  options={activeEvents}
                />
              )}
            </TaskStatus>
          )}
        </>
      )}

      <H3 as="h2">Notes</H3>

      <FieldInput
        type="text"
        name="subject"
        label="Subject"
        required="Enter a subject"
      />

      <FieldTextarea
        type="text"
        name="notes"
        label="Notes (optional)"
        hint="Use this text box to record any details of the logistics of the interaction eg how meeting(s) came about and where or when they happened. These are for your records. Do not include comments about issues impacting the company or feedback on government policy. Include that information in the business intelligence section."
      />

      <FieldRadios
        inline={true}
        name="was_policy_feedback_provided"
        legend="Did the contact provide business intelligence?"
        options={OPTIONS_YES_NO}
        required="Answer if the contact provided business intelligence"
      />

      {values.was_policy_feedback_provided === OPTION_YES && (
        <>
          <FieldCheckboxes
            name="policy_issue_types"
            legend="Policy issue types"
            options={policyIssueTypes}
            required="Select at least one policy issue type"
          />

          <FieldHelp
            helpSummary="Help with policy issue types"
            helpText="A policy type is the broad category/categories that the information fits into."
            footerUrl={helpUrl(2)}
            footerUrlDescription="See more guidance"
          />

          <FieldTypeahead
            isMulti={true}
            name="policy_areas"
            label="Policy area(s)"
            placeholder="-- Select policy area --"
            options={policyAreas}
            required="Select at least one policy area"
          />

          <FieldHelp
            helpSummary="Help with policy area(s)"
            helpText="A policy area is the specific area that the information fits into. Completing this enables the correct team(s) to find the information and input into their reports to support businesses and ministers effectively."
            footerUrl={helpUrl(3)}
            footerUrlDescription="See more guidance"
          />

          <FieldTextarea
            name="policy_feedback_notes"
            label="Business intelligence"
            required="Enter business intelligence"
            hint="Enter any comments the company made to you on areas such as issues impacting them or feedback on government policy. This information will be visible to other Data Hub users, the Business Intelligence Unit and may also be shared within DIT."
          />

          <FieldHelp
            helpSummary="Help with business intelligence"
            helpText={
              <>
                Consider these questions when filling out this text box:
                <p>What business intelligence did the company provide?</p>
                <p>
                  Why has the company raised this/these issue(s) and what are
                  the impacts on the company, sector and wider economy?
                </p>
                <p>
                  Did the company make any wider requests of DIT/HMG, including
                  ministerial engagement or policy changes? If so, provide
                  details.
                </p>
                Will the company be taking any further actions (eg investment
                decisions or job creation/losses)? If so, provide details.
              </>
            }
            footerUrl={helpUrl(4)}
            footerUrlDescription="See more guidance"
          />
        </>
      )}

      {!values.id && values.theme !== THEMES.INVESTMENT && (
        <>
          <FieldRadios
            inline={true}
            name="were_countries_discussed"
            legend="Were any countries discussed?"
            required="Answer if any countries were discussed"
            options={OPTIONS_YES_NO}
          />
          {values.were_countries_discussed === OPTION_YES && (
            <>
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.EXPORTING_TO}
                label="Countries currently exporting to"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.FUTURE_INTEREST}
                label="Future countries of interest"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.NOT_INTERESTED}
                label="Countries not interested in"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

const typeaheadOptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const typeaheadOptionsListProp = PropTypes.arrayOf(typeaheadOptionProp)

StepInteractionDetails.propTypes = {
  companyId: PropTypes.string.isRequired,
  services: typeaheadOptionsListProp.isRequired,
  serviceDeliveryStatuses: typeaheadOptionsListProp.isRequired,
  policyAreas: typeaheadOptionsListProp.isRequired,
  policyIssueTypes: typeaheadOptionsListProp.isRequired,
  communicationChannels: typeaheadOptionsListProp.isRequired,
  countries: typeaheadOptionsListProp.isRequired,
  activeEvents: typeaheadOptionsListProp,
  activeEvent: typeaheadOptionProp,
}

export default connect((state) => {
  const { activeEvents } = state[ID]
  return {
    activeEvents,
  }
}, null)(StepInteractionDetails)
