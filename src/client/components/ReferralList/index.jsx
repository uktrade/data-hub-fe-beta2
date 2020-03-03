import React from 'react'
import { SectionBreak, H3 } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import styled from 'styled-components'

import Task from '../Task'
import Referral from './Referral'
import { REFFERAL_LIST__LOADED } from '../../actions'
import multiInstance from '../../utils/multiinstance'
import reducer from './reducer'

const StyledItemSpacer = styled.div({
  '& > *': {
    marginTop: SPACING.SCALE_4,
  },
})

const ReferralList = ({ referrals }) => (
  <div>
    <H3>{pluralize('Referral', referrals.length, true)}</H3>
    <SectionBreak visible={true} />
    <StyledItemSpacer>
      {referrals.map(({ id, ...referral }) => (
        <Referral key={id} id={id} {...referral} />
      ))}
    </StyledItemSpacer>
  </div>
)

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.shape(Referral.propTypes)),
}

export default multiInstance({
  componentStateToProps: (state) => ({ referrals: state }),
  name: 'ReferralList',
  reducer,
  component: ({ id, referrals }) => (
    <Task.Status
      name="Referrals"
      id={id}
      progressMessage="Loading referrals"
      startOnRender={{
        onSuccessDispatch: REFFERAL_LIST__LOADED,
      }}
    >
      {() => referrals && <ReferralList referrals={referrals} />}
    </Task.Status>
  ),
})
