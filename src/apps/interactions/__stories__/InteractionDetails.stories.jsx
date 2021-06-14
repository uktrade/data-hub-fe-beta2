import React from 'react'
import { storiesOf } from '@storybook/react'
import InteractionDetailsForm from '../apps/details-form/client/InteractionDetailsForm'

const DEFAULT_INTERACTION = {
  companyId: '3cb006bb-c8bd-4062-bc8c-c086273b84e1',
  initialValues: {
    company: '3cb006bb-c8bd-4062-bc8c-c086273b84e1',
    date: { day: '28', month: '03', year: '2021' },
    contacts: [],
    dit_participants: [
      { value: '65f1a4cc-0171-4db8-8768-0428bd99dd71', label: '' },
    ],
  },
}

storiesOf('Company Interactions', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('With Trade Agreement', () => (
    <InteractionDetailsForm {...DEFAULT_INTERACTION}></InteractionDetailsForm>
  ))
