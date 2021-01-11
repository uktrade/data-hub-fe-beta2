import React from 'react'
import HintText from '@govuk-react/hint-text'
import { SelectInput } from '@govuk-react/select'
import pluralize from 'pluralize'
import styled from 'styled-components'

import ContentWithHeading from '../ContentWithHeading'
import StyledOrderedList from '../StyledOrderedList'
import { TaskStatus } from '../Task'
import Referral from './Referral'
import {
  REFERRAL_LIST__LOADED,
  REFERRAL_LIST__FILTER_CHANGE,
} from '../../actions'
import multiInstance from '../../utils/multiinstance'
import { SENT, RECEIVED } from './constants'
import reducer from './reducer'

const StyledLabel = styled.label({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledSelectInput = styled(SelectInput)({
  marginLeft: 10,
  // We need to increase specificity with & to override the 50% width
  '&': {
    width: 'initial',
  },
})

export default multiInstance({
  name: 'ReferralList',
  reducer,
  dispatchToProps: (dispatch) => ({
    onFilterChange: (filter) =>
      dispatch({
        type: REFERRAL_LIST__FILTER_CHANGE,
        filter,
      }),
  }),
  actionPattern: 'REFERRAL_LIST__',
  component: ({ id, referrals, onFilterChange, filter }) => (
    <TaskStatus
      name="Referrals"
      id={id}
      progressMessage="Loading referrals"
      startOnRender={{
        onSuccessDispatch: REFERRAL_LIST__LOADED,
      }}
    >
      {() => {
        if (referrals) {
          const filteredReferrals = referrals
            .filter(({ direction }) => direction === filter)
            .sort((a, b) => new Date(b.date) - new Date(a.date))

          return (
            <ContentWithHeading
              heading={pluralize(
                `${filter} referral`,
                filteredReferrals.length,
                true
              )}
              headingActions={
                <StyledLabel htmlFor="view-referrals">
                  View
                  <StyledSelectInput
                    value={filter}
                    id="view-referrals"
                    onChange={(e) => onFilterChange(e.target.value)}
                  >
                    <option value={RECEIVED} aria-label="received-referrals">
                      Received referrals
                    </option>
                    <option value={SENT} aria-label="sent-referrals">
                      Sent referrals
                    </option>
                  </StyledSelectInput>
                </StyledLabel>
              }
            >
              {referrals.length ? (
                <StyledOrderedList>
                  {filteredReferrals.map(({ id, ...referral }) => (
                    <li key={id}>
                      <Referral id={id} {...referral} />
                    </li>
                  ))}
                </StyledOrderedList>
              ) : (
                <HintText>
                  You have not received or sent any referrals.
                  <br />
                  You can refer companies to other advisers from a company page.
                </HintText>
              )}
            </ContentWithHeading>
          )
        }
      }}
    </TaskStatus>
  ),
})
