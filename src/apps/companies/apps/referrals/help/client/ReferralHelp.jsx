import React from 'react'
import { connect } from 'react-redux'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { NewWindowLink } from '../../../../../../client/components/'
import urls from '../../../../../../lib/urls'

import { TaskStatus } from '../../../../../../client/components/Task'
import { state2props } from './state'

import { REFERRAL_DETAILS } from '../../../../../../client/actions'

const AdviserDetails = ({ name, email }) => (
  <>
    {name}
    {email && (
      <>
        , <a href={`mailto:${email}`}>{email}</a>
      </>
    )}
  </>
)

export default connect(state2props)(
  ({ companyId, referralId, company, sendingAdviser }) => {
    // Although this input creates impurity I think for simplicity its ok in this context
    const host = `${window.location.protocol}//${window.location.host}`
    const relReferralLink = urls.companies.referrals.details(
      companyId,
      referralId
    )
    const absReferralLink = `${host}${urls.companies.referrals.details(
      companyId,
      referralId
    )}`
    return (
      <TaskStatus
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
              <H2 size={LEVEL_SIZE[3]}>I need more information</H2>

              <p>
                Contact the sender for more info:{' '}
                <AdviserDetails {...sendingAdviser} />
              </p>
              <p>
                Or{' '}
                <NewWindowLink href={urls.external.digitalWorkspace.teams}>
                  find their contact details on Digital Workspace
                </NewWindowLink>
              </p>
              <H2 size={LEVEL_SIZE[3]}>I'm not the right adviser for this</H2>

              <p>
                Forward this referral onto someone else. Paste this URL into an
                email: <Link href={relReferralLink}>{absReferralLink}</Link>
              </p>
              <Link href={relReferralLink}>Back to the referral</Link>
            </>
          )
        }
      </TaskStatus>
    )
  }
)
