import React from 'react'
import { storiesOf } from '@storybook/react'

import DateField from 'DateField'

const collectionStories = storiesOf('DateField', module)

const BasicDateField = () => {
  return (
    <DateField
      name="start_date"
      initialValue="2020-02-02"
      label="Start Date"
      legend="This is a start date field"
      hint="When it began"
    />
  )
}
const AlertChangeDateField = () => {
  return (
    <DateField
      name="end_date"
      initialValue="2020-12-31"
      label="End Date"
      onChange={() => alert('End date changed!')}
    />
  )
}

collectionStories
  .add('Basic', () => <BasicDateField />)
  .add('Callback on Change', () => <AlertChangeDateField />)
