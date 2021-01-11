import React from 'react'
import { connect } from 'react-redux'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import urls from '../../../../../../lib/urls'
import url from 'url'
import { ID as STATE_ID } from './state'

import SecondaryButton from '../../../../../../client/components/SecondaryButton'
import FormActions from '../../../../../../client/components/Form/elements/FormActions'
import SummaryTable from '../../../../../../client/components/SummaryTable'
import Task from '../../../../../../client/components/Task'
import { format } from '../../../../../../client/utils/date-utils'

import { REFERRAL_DETAILS } from '../../../../../../client/actions'

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

export default connect(({ referrerUrl, ...state }) => ({
  ...state[STATE_ID],
  referrerUrl,
}))(
  ({
    subject,
    referralId,
    company,
    contact,
    sendingAdviser,
    receivingAdviser,
    date,
    notes,
    completed,
    interaction,
    referrerUrl,
  }) => {
    const cameFromHomePage =
      url.parse(referrerUrl).pathname === urls.companies.referrals.list()

    return (
      <Task.Status
        name="Referral details"
        id="referralDetails"
        progressMessage="loading referral details"
        startOnRender={{
          payload: referralId,
          onSuccessDispatch: REFERRAL_DETAILS,
        }}
      >
        {() =>
          company && (
            <>
              <SummaryTable caption={subject}>
                <SummaryTable.Row heading="Company">
                  <Link href={urls.companies.detail(company.id)}>
                    {company.name}
                  </Link>
                </SummaryTable.Row>
                {contact && (
                  <SummaryTable.Row heading="Contact">
                    <Link href={urls.contacts.contact(contact.id)}>
                      {contact.name}
                    </Link>
                  </SummaryTable.Row>
                )}
                <SummaryTable.Row heading="Sending adviser">
                  {sendingAdviser && <AdviserDetails {...sendingAdviser} />}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Receiving adviser">
                  {receivingAdviser && <AdviserDetails {...receivingAdviser} />}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Date of referral">
                  {format(date)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Notes">{notes}</SummaryTable.Row>
              </SummaryTable>
              {completed ? (
                <SummaryTable caption="Referral accepted">
                  <SummaryTable.Row heading="Date">
                    {format(completed.on)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="By">
                    <AdviserDetails {...completed.by} />
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="With interaction">
                    <Link href={urls.interactions.detail(interaction.id)}>
                      {interaction.subject}
                    </Link>
                  </SummaryTable.Row>
                </SummaryTable>
              ) : (
                <>
                  <Details summary="Why can I not edit the referral?">
                    <p>
                      For now, you can't edit the referral once it's been sent.
                    </p>
                    <p>Contact the recipient if something's changed.</p>
                  </Details>
                  <FormActions>
                    <Button
                      as={Link}
                      href={urls.companies.referrals.interactions.create(
                        company.id,
                        referralId
                      )}
                    >
                      Accept referral
                    </Button>
                    <SecondaryButton
                      as={Link}
                      href={urls.companies.referrals.help(
                        company.id,
                        referralId
                      )}
                    >
                      I cannot accept the referral
                    </SecondaryButton>
                    <Link
                      href={
                        cameFromHomePage
                          ? urls.companies.referrals.list()
                          : urls.companies.detail(company.id)
                      }
                    >
                      Back
                    </Link>
                  </FormActions>
                </>
              )}
            </>
          )
        }
      </Task.Status>
    )
  }
)
