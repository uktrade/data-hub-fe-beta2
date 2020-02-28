import React from 'react'
import { connect } from 'react-redux'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import { SummaryTable, FormActions, DateUtils } from 'data-hub-components'

import Task from '../../../../../client/components/Task'
import { state2props } from './state'

import { REFERRAL_DETAILS } from '../../../../../client/actions'

export const AdviserDetails = ({ name, email, team }) => (
  <>
    {name}
    {email && (
      <>
        , <a href={`mailto:${email}`}>{email}</a>
      </>
    )}
    {team && <>, {team}</>}
  </>
)

AdviserDetails.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  team: PropTypes.string,
}

export default connect(state2props)(
  ({
    subject,
    id,
    company,
    contact,
    sendingAdviser,
    receivingAdviser,
    date,
    notes,
  }) => (
    <Task.Status
      name="Referral details"
      id="referralDetails"
      progressMessage="loading referral details"
      startOnRender={{
        payload: id,
        onSuccessDispatch: REFERRAL_DETAILS,
      }}
    >
      {() =>
        company && (
          <>
            <SummaryTable caption={`Referral sent - ${subject}`}>
              <SummaryTable.Row heading="Company">{company}</SummaryTable.Row>
              <SummaryTable.Row heading="Contact">{contact}</SummaryTable.Row>
              <SummaryTable.Row heading="Sending adviser">
                {sendingAdviser && <AdviserDetails {...sendingAdviser} />}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Receiving adviser">
                {receivingAdviser && <AdviserDetails {...receivingAdviser} />}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Date of referral">
                {DateUtils.format(date)}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Notes">{notes}</SummaryTable.Row>
            </SummaryTable>
            <Details summary="Why can I not edit the referral?">
              <p>
                This referral has been placed in the "My referrals" section on
                the Homepage of both the recipient and sender. If necessary
                contact the receiving adviser directly if any of the information
                has changed.
              </p>
            </Details>
            <FormActions>
              <Button as={Link} href="/">
                Complete referral
              </Button>
              <Link href="/">Back</Link>
            </FormActions>
          </>
        )
      }
    </Task.Status>
  )
)
