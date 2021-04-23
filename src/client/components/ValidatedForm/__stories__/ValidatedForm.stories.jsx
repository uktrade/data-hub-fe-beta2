import _ from 'lodash'
import React from 'react'
import { storiesOf } from '@storybook/react'

import ValidatedForm from '..'
import Input from '../Fields/Input'
import Radios from '../Fields/Radios'
import Select from '../Fields/Select'
import Textarea from '../Fields/Textarea'

const VALIDATORS = {
  inputField: (x) =>
    x?.length === 3 || Error('Must be exactly 3 characters long'),
  textareaField: (x) =>
    x
      ? x.match(/\n/) || Error('Must be multiline')
      : Error('Must not be empty'),
  radiosField: (x) => x || Error('Choose one option'),
  selectField: (x) => x || Error('Choose one option'),
}

storiesOf('ValidatedForm')
  .add('Single step', () => (
    <ValidatedForm
      id="ValidatedForm.single-step-example"
      onSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={VALIDATORS}
    >
      {(field) => (
        <>
          <Input label="Input field" {...field('inputField', 'fooo')} />
          <Textarea label="Textarea field" {...field('textareaField')} />
          <Radios
            id="ValidatedForm.single-step-example.radiosField"
            label="Radios field"
            options={{
              Foo: { value: 'foo' },
              Bar: { value: 'bar' },
              Baz: { value: 'baz' },
            }}
            {...field('radiosField')}
          />
          <Select
            id="ValidatedForm.single-step-example.selectField"
            label="Select field"
            options={{
              Foo: 'foo',
              Bar: 'bar',
              Baz: 'baz',
            }}
            {...field('selectField')}
          />
        </>
      )}
    </ValidatedForm>
  ))
  .add('Three steps as children', () => (
    <ValidatedForm
      id="ValidatedForm.three-steps-as-children-example"
      onSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={{
        ...VALIDATORS,
        anotherInputField: VALIDATORS.inputField,
      }}
    >
      {(field) => (
        <>
          <h2>Step 1/3</h2>
          <Input label="Input field" {...field('inputField', 'foo')} />
          <Textarea
            label="Textarea field"
            {...field('textareaField', 'foo\nbar')}
          />
        </>
      )}
      {(field) => (
        <>
          <h2>Step 2/3</h2>
          <Radios
            id="ValidatedForm.three-steps-as-children.radiosField"
            label="Radios field"
            options={{
              Foo: { value: 'foo' },
              Bar: { value: 'bar' },
              Baz: { value: 'baz' },
            }}
            {...field('radiosField', 'bar')}
          />
          <Select
            id="ValidatedForm.three-steps-as-children.selectField"
            label="Select field"
            options={{
              Foo: 'foo',
              Bar: 'bar',
              Baz: 'baz',
            }}
            {...field('selectField')}
          />
        </>
      )}
      {(field) => (
        <>
          <h2>Step 3/3</h2>
          <Input label="Another input field" {...field('anotherInputField')} />
        </>
      )}
    </ValidatedForm>
  ))
  .add('Three steps as array', () => (
    <ValidatedForm
      id="ValidatedForm.three-steps-example"
      onSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={{
        ...VALIDATORS,
        anotherInputField: VALIDATORS.inputField,
      }}
    >
      {[
        (field) => (
          <>
            <h2>Step 1/3</h2>
            <Input label="Input field" {...field('inputField', 'foo')} />
            <Textarea
              label="Textarea field"
              {...field('textareaField', 'foo\nbar')}
            />
          </>
        ),
        (field) => (
          <>
            <h2>Step 2/3</h2>
            <Radios
              id="ValidatedForm.single-step-example.radiosField"
              label="Radios field"
              options={{
                Foo: { value: 'foo' },
                Bar: { value: 'bar' },
                Baz: { value: 'baz' },
              }}
              {...field('radiosField', 'bar')}
            />
            <Select
              id="ValidatedForm.single-step-example.selectField"
              label="Select field"
              options={{
                Foo: 'foo',
                Bar: 'bar',
                Baz: 'baz',
              }}
              {...field('selectField')}
            />
          </>
        ),
        (field) => (
          <>
            <h2>Step 3/3</h2>
            <Input
              label="Another input field"
              {...field('anotherInputField')}
            />
          </>
        ),
      ]}
    </ValidatedForm>
  ))
  .add('Non-validated (optional) fields', () => (
    <ValidatedForm
      id="ValidatedForm.non-validated-fields-example"
      onSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={_.pick(VALIDATORS, ['inputField', 'textareaField'])}
    >
      {[
        (field) => (
          <>
            <Input label="Input field" {...field('inputField', 'foo')} />
            <Textarea
              label="Textarea field"
              {...field('textareaField', 'foo\nbar')}
            />
            <label style={{ display: 'block' }}>
              This vanilla input doesn't take part in validation, but is part of
              form submission.
              <input type="text" name="optional-vanilla-input" />
            </label>
          </>
        ),
      ]}
    </ValidatedForm>
  ))
  .add('Docstring example', () => (
    <ValidatedForm
      id="ValidatedForm.docstring-example"
      onSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={{
        username: (x) =>
          x?.length > 7 || Error('Must be at least 8 characters long'),
        password: (x) =>
          x?.match(/(?=.*[A-Z]+)(?=.*\d+)/) ||
          Error('Must contain an uppercase character and a digit'),
        passwordConf: (x, { password }) =>
          x === password || Error('Passwords must match'),
      }}
    >
      {(field) => (
        <>
          <h2>Step 1</h2>
          <Input label="Username" {...field('username')} />
        </>
      )}
      {(field) => (
        <>
          <h2>Step 2</h2>
          <Input type="password" label="Password" {...field('password')} />
          <Input
            type="password"
            label="Repeat password"
            {...field('passwordConf')}
          />
        </>
      )}
    </ValidatedForm>
  ))
