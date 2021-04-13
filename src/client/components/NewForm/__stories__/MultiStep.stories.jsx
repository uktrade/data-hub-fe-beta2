/* eslint-disable prettier/prettier */
import _ from 'lodash'
import React from 'react'
import { storiesOf } from '@storybook/react'

import MultiStepForm from '../MultiStep'
import Input from '../Fields/Input'
import Radios from '../Fields/Radios'
import Select from '../Fields/Select'
import Textarea from '../Fields/Textarea'

const VALIDATORS = {
  inputField: x => x.length === 3 || Error('Must be exactly 3 characters long'),
  textareaField: x => x
    ? x.match(/\n/) || Error('Must be multiline')
    : Error('Must not be empty'),
  radiosField: x => x || Error('Choose one option'),
  selectField: x =>  x || Error('Choose one option'),
}

storiesOf('MultiStepForm')
  .add('Three steps', () => (
    <MultiStepForm
      id="ValidatedMultiStepForm.three-steps-example"
      onValidSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={{
        ...VALIDATORS,
        anotherInputField: VALIDATORS.inputField,
      }}
    >
      {[
        field =>
          <>
            <h2>Step 1/3</h2>
            <Input
              label="Input field"
              {...field('inputField', 'foo')}
            />
            <Textarea
              label="Textarea field"
              {...field('textareaField', 'foo\nbar')}
            />
          </>,
        field =>
          <>
            <h2>Step 2/3</h2>
            <Radios
              id="ValidatedMultiStepForm.single-step-example.radiosField"
              label="Radios field"
              options={{
                Foo: {value: 'foo'},
                Bar: {value: 'bar'},
                Baz: {value: 'baz'},
              }}
              {...field('radiosField', 'bar')}
            />
            <Select
              id="ValidatedMultiStepForm.single-step-example.selectField"
              label="Select field"
              options={{
                Foo: 'foo',
                Bar: 'bar',
                Baz: 'baz',
              }}
              {...field('selectField')}
            />
          </>,
        field =>
          <>
            <h2>Step 3/3</h2>
            <Input
              label="Another input field"
              {...field('anotherInputField')}
            />
          </>,
      ]}
    </MultiStepForm>
  ))
  .add('Single step', () =>
    <MultiStepForm
      id="ValidatedMultiStepForm.single-step-example"
      onValidSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={VALIDATORS}
    >
      {[
        field =>
          <>
            <Input
              label="Input field"
              {...field('inputField', 'fooo')}
            />
            <Textarea
              label="Textarea field"
              {...field('textareaField')}
            />
            <Radios
              id="ValidatedMultiStepForm.single-step-example.radiosField"
              label="Radios field"
              options={{
                Foo: {value: 'foo'},
                Bar: {value: 'bar'},
                Baz: {value: 'baz'},
              }}
              {...field('radiosField')}
            />
            <Select
              id="ValidatedMultiStepForm.single-step-example.selectField"
              label="Select field"
              options={{
                Foo: 'foo',
                Bar: 'bar',
                Baz: 'baz',
              }}
              {...field('selectField')}
            />
          </>,
      ]}
    </MultiStepForm>
  )
  .add('Non-validated (optional) fields', () => (
    <MultiStepForm
      id="ValidatedMultiStepForm.non-validated-fields-example"
      onValidSubmit={(e, values) => {
        e.preventDefault()
        alert(JSON.stringify(values, null, 2))
      }}
      validators={_.pick(VALIDATORS, ['inputField', 'textareaField'])}
    >
      {[
        field =>
          <>
            <Input
              label="Input field"
              {...field('inputField', 'foo')}
            />
            <Textarea
              label="Textarea field"
              {...field('textareaField', 'foo\nbar')}
            />
            <label style={{display: 'block'}}>
              This vanilla input doesn't take part in validation, but
              is part of form submission.
              <input type="text" name="optional-vanilla-input"/>
            </label>
         </>
      ]}
    </MultiStepForm>
  ))
