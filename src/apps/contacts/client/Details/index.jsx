import React from 'react'
import { SummaryList } from 'data-hub-components'

import Task from '../../../../client/components/Task'
import multiInstance from '../../../../client/utils/multiinstance'
import { CONTACT_DETAILS__LOADED } from '../../../../client/actions'

import reducer from './reducer'

const ContactDetails = ({
  id,
  jobTitle,
  phoneNumber,
  address,
  email,
  acceptsMarketing,
}) => (
  <Task.Status
    name="Contact details"
    id={id}
    startOnRender={{
      payload: id,
      onSuccessDispatch: CONTACT_DETAILS__LOADED,
    }}
  >
    {() => (
      <SummaryList
        rows={[
          {
            label: 'Job title',
            value: jobTitle,
          },
          {
            label: 'Phone number',
            value: phoneNumber,
          },
          {
            label: 'Address',
            value: address,
          },
          {
            label: 'Email',
            value: email,
          },
          {
            label: 'Email marketing',
            value: acceptsMarketing ? 'Yes' : 'Cannot be marketed to',
          },
        ]}
      />
    )}
  </Task.Status>
)

export default multiInstance({
  name: 'ContactDetails',
  reducer,
  component: ContactDetails,
})
