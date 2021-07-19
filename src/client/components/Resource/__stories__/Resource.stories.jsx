import React from 'react'
import { storiesOf } from '@storybook/react'

import TabNav from '../../TabNav'
import Contact from '../Contact'
import Company from '../Company'
import Resource from '..'

const Json = ({ children }) => <pre>{JSON.stringify(children, null, 2)}</pre>

storiesOf('Resource', module).add('Default', () => (
  <TabNav
    id="resource-example"
    label="Resource examples"
    tabs={[
      {
        label: 'Example resolved',
        content: (
          <Resource name="Resource example" id="resource-example-resolve">
            {(resource) => <Json>{resource}</Json>}
          </Resource>
        ),
      },
      {
        label: 'Example rejected',
        content: (
          <Resource name="Resource example" id="resource-example-reject">
            {(resource) => <Json>{resource}</Json>}
          </Resource>
        ),
      },
      {
        label: 'Contact',
        content: (
          <Contact id="foo">{(contact) => <Json>{contact}</Json>}</Contact>
        ),
      },
      {
        label: 'Company',
        content: (
          <Company id="bar">{(company) => <Json>{company}</Json>}</Company>
        ),
      },
    ]}
  />
))
