import React from 'react'
import { H3, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import * as colors from 'govuk-colours'
import PropTypes from 'prop-types'
import { SummaryList, Badge, DateUtils } from 'data-hub-components'
import styled from 'styled-components'

import urls from '../../../lib/urls'
// TODO: Move to client/components
import { AdviserDetails } from '../../../apps/referrals/client/referralDetails'

const StyledRoot = styled.div({
  border: `1px solid ${colors.GREY_2}`,
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
  background: colors.GREY_4,
  padding: SPACING.SCALE_2,
})
const StyledLink = styled(Link)({
  textDecoration: 'none',
})

const Referral = ({
  id,
  companyName,
  title,
  date,
  sendingAdviser,
  receivingAdviser,
}) => (
  <StyledRoot>
    <StyledHeader>{companyName}</StyledHeader>
    <StyledRow>
      <H3>
        <StyledLink href={urls.referrals.details(id)}>{title}</StyledLink>
      </H3>
      <div>{DateUtils.format(date)}</div>
    </StyledRow>
    <StyledRow>
      {/* We need to wrap SummaryList as it can't be restyled */}
      <StyledSummaryListWrapper>
        <SummaryList
          rows={[
            {
              label: 'Sending adviser(s)',
              value: <AdviserDetails {...sendingAdviser} />,
            },
            {
              label: 'Receiving adviser(s)',
              value: <AdviserDetails {...receivingAdviser} />,
            },
          ]}
        />
      </StyledSummaryListWrapper>
      <Badge borderColour={colors.BLUE}>Outstanding Referral</Badge>
    </StyledRow>
  </StyledRoot>
)

Referral.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sendingAdviser: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  receivingAdviser: PropTypes.shape(AdviserDetails.propTypes).isRequired,
}

export default Referral
