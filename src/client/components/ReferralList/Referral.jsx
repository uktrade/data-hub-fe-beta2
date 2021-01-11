import React from 'react'
import Link from '@govuk-react/link'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import { BLUE, GREEN } from 'govuk-colours'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { AdviserDetails } from '../../../apps/companies/apps/referrals/details/client/ReferralDetails'
import { CardHeader } from '../ActivityFeed/activities/card'
import { Card } from '../ActivityFeed/activities/card'
import SummaryList from '../../components/SummaryList'
import { format } from '../../utils/date-utils'
import urls from '../../../lib/urls'

const StyledSummaryListWrapper = styled.div({
  flexGrow: 1,
  marginRight: SPACING.SCALE_2,
  dt: {
    fontSize: `${FONT_SIZE.SIZE_16}`,
    // Prevent the left column from shrinking,
    // when the right column's content is too long.
    flexShrink: 0,
    // The original 30% column width doesn't work well in this usecase
    flexBasis: 160,
  },
  dd: {
    fontSize: `${FONT_SIZE.SIZE_16}`,
  },
})

const Referral = ({
  id,
  companyId,
  companyName,
  subject,
  date,
  sender,
  recipient,
  dateAccepted,
}) => (
  <Card>
    <CardHeader
      company={{ name: companyName }}
      heading={
        <Link href={urls.companies.referrals.details(companyId, id)}>
          {subject}
        </Link>
      }
      headingLevel={2}
      startTime={date}
      badge={
        dateAccepted
          ? {
              text: 'Accepted referral',
              borderColour: GREEN,
            }
          : {
              text: 'Outstanding referral',
              borderColour: BLUE,
            }
      }
    />
    {/* SummaryList is not stylable so we need to wrap it to tweak it's styles */}
    <StyledSummaryListWrapper>
      <SummaryList
        rows={[
          {
            label: 'Sending adviser',
            value: <AdviserDetails {...sender} />,
          },
          {
            label: 'Receiving adviser',
            value: <AdviserDetails {...recipient} />,
          },
          ...(dateAccepted
            ? [
                {
                  label: 'Accepted on',
                  value: format(dateAccepted),
                },
              ]
            : []),
        ]}
      />
    </StyledSummaryListWrapper>
  </Card>
)

Referral.propTypes = {
  id: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sender: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  recipient: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  dateAccepted: PropTypes.string,
}

export default Referral
