import React from 'react'
import { SectionBreak, H3 } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
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

const ReferralList = ({ items }) => (
  <div>
    <H3>{pluralize('Referral', items.length, true)}</H3>
    <SectionBreak visible={true} />
    <StyledItemSpacer>
      {items.map(({ id, ...referral }) => (
        <Referral key={id} id={id} {...referral} />
      ))}
    </StyledItemSpacer>
  </div>
)

ReferralList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(ReferralList.propTypes)),
}

export default multiInstance({
  componentStateToProps: (state) => ({ items: state }),
  name: 'ReferralList',
  reducer,
  component: ({ id, items }) => (
    console.log('items', items),
    (
      <Task.Status
        name="Referrals"
        id={id}
        progressMessage="Loading referrals"
        startOnRender={{
          onSuccessDispatch: REFFERAL_LIST__LOADED,
        }}
      >
        {() => items && <ReferralList items={items} />}
      </Task.Status>
    )
  ),
})
