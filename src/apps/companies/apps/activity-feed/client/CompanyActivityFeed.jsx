import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import Paragraph from '@govuk-react/paragraph'
import WarningText from '@govuk-react/warning-text'
import { BLACK } from 'govuk-colours'
import styled from 'styled-components'

import {
  ActivityFeedApp,
  ActivityFeedAction,
  StatusMessage,
} from '../../../../../client/components'
import { companies } from '../../../../../lib/urls'

const StyledLink = styled('a')`
  margin-bottom: 0;
`

const CompanyActivityFeed = ({
  company,
  showMatchingPrompt,
  activityTypeFilter,
  activityTypeFilters,
  isGlobalUltimate,
  dnbHierarchyCount,
  isTypeFilterFlagEnabled,
  isGlobalUltimateFlagEnabled,
  apiEndpoint,
}) => {
  const actions = (
    <>
      <ActivityFeedAction
        text="Refer this company"
        link={companies.referrals.send(company.id)}
      />
      <ActivityFeedAction
        text="Add interaction"
        link={companies.interactions.create(company.id)}
      />
    </>
  )

  return (
    <>
      {showMatchingPrompt && (
        <StatusMessage colour={BLACK} id="ga-company-details-matching-prompt">
          <WarningText>
            Business details on this company record have not been verified and
            could be wrong.
          </WarningText>
          <Details summary="Why verify?">
            <Paragraph>
              Using verified business details from a trusted third-party
              supplier means we can keep certain information up to date
              automatically. This helps reduce duplicate records, provide a
              shared view of complex companies and make it more likely we can
              link other data sources together.
            </Paragraph>
            <Paragraph>
              Verification can often be done in just 4 clicks.
            </Paragraph>
          </Details>
          <Button as={StyledLink} href={companies.match.index(company.id)}>
            Verify business details
          </Button>
        </StatusMessage>
      )}
      <ActivityFeedApp
        actions={!company.archived && actions}
        activityTypeFilter={activityTypeFilter}
        activityTypeFilters={activityTypeFilters}
        isGlobalUltimate={isGlobalUltimate}
        dnbHierarchyCount={dnbHierarchyCount}
        isTypeFilterFlagEnabled={isTypeFilterFlagEnabled}
        isGlobalUltimateFlagEnabled={isGlobalUltimateFlagEnabled}
        apiEndpoint={apiEndpoint}
      />
    </>
  )
}

CompanyActivityFeed.propTypes = {
  companyId: PropTypes.string,
  actions: PropTypes.node,
  activityTypeFilter: PropTypes.string,
  activityTypeFilters: PropTypes.object,
  apiEndpoint: PropTypes.string.isRequired,
  isGlobalUltimate: PropTypes.bool,
  dnbHierarchyCount: PropTypes.number,
  isTypeFilterFlagEnabled: PropTypes.bool,
  isGlobalUltimateFlagEnabled: PropTypes.bool,
  showMatchingPrompt: PropTypes.bool,
}

CompanyActivityFeed.defaultProps = {
  companyId: null,
  activityTypeFilter: null,
  activityTypeFilters: {},
  actions: null,
  isGlobalUltimate: false,
  dnbHierarchyCount: null,
  isTypeFilterFlagEnabled: false,
  isGlobalUltimateFlagEnabled: false,
  showMatchingPrompt: false,
}

export default CompanyActivityFeed
