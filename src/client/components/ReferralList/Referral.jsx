import { capitalize } from 'lodash'
import React from 'react'
import { H3, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { BLUE, GREEN, GREY_2, GREY_4 } from 'govuk-colours'
import PropTypes from 'prop-types'
import { SummaryList, Badge, DateUtils } from 'data-hub-components'
import styled from 'styled-components'

import urls from '../../../lib/urls'
// TODO: Move to client/components
import { AdviserDetails } from '../../../apps/referrals/apps/details/client/ReferralDetails'

const STATUS_COLOURS = {
  outstanding: BLUE,
  completed: GREEN,
}

const StyledRoot = styled.div({
  border: `1px solid ${GREY_2}`,
})
const StyledRow = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  margin: SPACING.SCALE_2,
})
const StyledSummaryListWrapper = styled.div({
  flexGrow: 1,
})
const StyledHeader = styled.div({
  background: GREY_4,
  padding: SPACING.SCALE_2,
})
const StyledLink = styled(Link)({
  textDecoration: 'none',
})
const StyledH3 = styled(H3)({
  margin: 0,
})

const Referral = ({
  id,
  companyName,
  subject,
  date,
  sender,
  recipient,
  status,
}) => (
  <StyledRoot>
    <StyledHeader>{companyName}</StyledHeader>
    <StyledRow>
      <StyledH3>
        <StyledLink href={urls.referrals.details(id)}>{subject}</StyledLink>
      </StyledH3>
      <div>{DateUtils.format(date)}</div>
    </StyledRow>
    <StyledRow>
      {/* We need to wrap SummaryList as it can't be restyled */}
      <StyledSummaryListWrapper>
        <SummaryList
          rows={[
            {
              label: 'Sending adviser(s)',
              value: <AdviserDetails {...sender} />,
            },
            {
              label: 'Receiving adviser(s)',
              value: <AdviserDetails {...recipient} />,
            },
          ]}
        />
      </StyledSummaryListWrapper>
      <Badge borderColour={STATUS_COLOURS[status]}>
        {capitalize(status)} referral
      </Badge>
    </StyledRow>
  </StyledRoot>
)

Referral.propTypes = {
  id: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sender: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  recipient: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  status: PropTypes.oneOf(['outstanding', 'completed']),
}

export default Referral
