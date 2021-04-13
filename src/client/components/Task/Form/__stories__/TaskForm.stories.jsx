import React from 'react'
import { storiesOf } from '@storybook/react'

import TaskForm from '..'
import Input from '../../../NewForm/Fields/Input'
import Radios from '../../../NewForm/Fields/Radios'
import Select from '../../../NewForm/Fields/Select'
import Textarea from '../../../NewForm/Fields/Textarea'

storiesOf('Task/Form', module).add('TaskFormAlt multi step', () => (
  <TaskForm
    name="Dummy form task"
    id="TaskFormAlt-multi-step-example"
    taskErrorToErrors={(e) => e}
    // onSuccessDispatch="DUMMY_FORM_TASK_SUCCESS"
    // onSuccessRender={<h1>Form was submitted successfully</h1>}
    onSuccess={(result) => alert(`Success:\n${JSON.stringify(result)}`)}
    valuesToPayload={({ rejectWithFieldErrorsValue, delay, ...values }) => ({
      ...values,
      rejectWithFieldErrorsValue:
        rejectWithFieldErrorsValue && JSON.parse(rejectWithFieldErrorsValue),
      delay: parseInt(delay, 10),
    })}
    validators={{
      foo: (v) => v?.length > 3 || Error('Foo must be at least 4 characters'),
      bar: (v) =>
        v === 'invalid' && Error('Bar must not be the "invalid" option'),
      delay: (v) =>
        isNaN(parseInt(v, 10)) && Error('Delay must be a valid number'),
      resolveOrReject: (v) => v || Error('Choose success or error'),
      resolveValue: () => {},
      rejectWithErrorStringValue: () => {},
    }}
  >
    {[
      (field) => (
        <>
          <Radios
            hint={['name="resolveOrReject"']}
            label="Should the task succeed or fail?"
            id="TaskFormAlt.multi-step-example.resolveOrReject"
            options={{
              Succeed: {
                value: 'resolve',
                inset: (
                  <Textarea
                    {...field('resolveValue')}
                    label="Resolve value"
                    defaultValue="Foo"
                  />
                ),
              },
              Reject: {
                value: 'rejectWithErrorString',
                inset: (
                  <Textarea
                    {...field('rejectWithErrorStringValue')}
                    label="Reject value"
                    defaultValue="Something went wrong"
                  />
                ),
              },
            }}
            {...field('resolveOrReject')}
          />
          <Input
            defaultValue="1000"
            label="Task delay in milliseconds"
            hint={['name="delay"']}
            {...field('delay')}
          />
        </>
      ),
      (field) => (
        <>
          <Input
            label="Foo"
            hint={['name="foo"']}
            defaultValue="fooooo"
            {...field('foo')}
          />
          <Select
            label="Bar"
            hint={['name="bar"']}
            options={{
              Bar: 'bar',
              Bing: 'bing',
              Invalid: 'invalid',
            }}
            {...field('bar')}
          />
        </>
      ),
    ]}
  </TaskForm>
))
