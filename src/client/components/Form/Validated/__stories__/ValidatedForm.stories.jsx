import React from 'react'
import { storiesOf } from '@storybook/react'
import Checkbox from '@govuk-react/checkbox'

import ValidatedForm from '..'
import Input from '../../Fields/Input'
import Radios from '../../Fields/Radios'
import Select from '../../Fields/Select'
import Textarea from '../../Fields/Textarea'

const barValidator = (v) =>
  ['foo', 'bar'].includes(v) || Error('Chose Foo or Bar')

const submitToAlert = (e, values) => {
  e.preventDefault()
  alert(JSON.stringify(values, null, 2))
}

storiesOf('ValidatedForm')
  .add('All field types', () => (
    <ValidatedForm
      id="foo"
      validators={{
        inputField: (v) => v?.length > 3 || Error('Too short'),
        selectField: (v) => v === 'invalid' && Error('Must be a valid choice'),
        textareaField: (v) => v || Error('Must not be empty'),
        radioField: (v) => v === 'invalid' && Error('Must be a valid choice'),
      }}
      onSubmit={submitToAlert}
    >
      {(field) => (
        <>
          <Input
            {...field('inputField')}
            label="Input field"
            defaultValue="fooo"
          />
          <Textarea
            {...field('textareaField')}
            label="Textarea field"
            defaultValue="blah"
          />
          <Select
            {...field('selectField')}
            label="Select field"
            defaultValue="bar"
            options={{
              Foo: 'foo',
              Bar: 'bar',
              Baz: 'baz',
              Invalid: 'invalid',
            }}
          />
          <Radios
            {...field('radioField')}
            label="Radio field"
            defaultValue="bar"
            options={{
              Foo: { value: 'foo' },
              Bar: { value: 'bar' },
              Baz: { value: 'baz' },
              Invalid: { value: 'invalid' },
            }}
          />
          <Checkbox name="checkboxField">Checkbox field</Checkbox>
        </>
      )}
    </ValidatedForm>
  ))
  .add('Interdependent validators', () => (
    <ValidatedForm
      id="bar"
      validators={{
        foo: (v) => v.length > 3 || Error('Too short'),
        bar: barValidator,
        baz: (v, { bar }) =>
          bar === 'bar' && (v?.length === 3 || Error('Must be 3 characters')),
      }}
      onSubmit={submitToAlert}
    >
      {(field) => (
        <>
          <Input {...field('foo')} label="Foo" />
          <Radios
            {...field('bar')}
            id="bar"
            label="Bar"
            options={{
              Foo: { value: 'foo' },
              Bar: {
                value: 'bar',
                inset: <Input {...field('baz')} />,
              },
              Invalid: { value: 'baz' },
            }}
          />
        </>
      )}
    </ValidatedForm>
  ))
