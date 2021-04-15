import React from 'react'
import { storiesOf } from '@storybook/react'

import TaskForm from '..'
import Input from '../../../ValidatedForm/Fields/Input'
import Radios from '../../../ValidatedForm/Fields/Radios'

const mustBeInteger = (x) => x?.match(/^\d+$/) || Error('Must be an integer')

const mustChooseOne = (x) => x || Error('Choose one option')

const mustBeLongerThan = (n) => (x) =>
  x?.length > n || Error(`Value must be at least ${n + 1} characters`)

const VALIDATORS = {
  resolveOrReject: mustChooseOne,
  value: mustBeLongerThan(2),
  delay: mustBeInteger,
}

storiesOf('Task/Form', module)
  .add('Render success message', () => {
    const id = 'Task/Form-example'
    return (
      <>
        <p>
          Example of a TaskForm which renders a success message when the task
          resolves.
        </p>
        <TaskForm
          name="Dummy form task"
          id={id}
          taskErrorToErrors={(e) => e}
          validators={VALIDATORS}
          resultToSuccessMessage={({ result }) =>
            `The task resolved with the value "${result}"`
          }
        >
          {(field) => (
            <>
              <Radios
                label="Should the task resolve or reject?"
                id={`${id}.resolveOrReject`}
                hint={['name="resolveOrReject"']}
                options={{
                  Resolve: { value: 'resolve' },
                  Reject: { value: 'reject' },
                }}
                {...field('resolveOrReject')}
              />
              <Input
                defaultValue="1000"
                label="Task delay in milliseconds"
                hint={['name="delay"']}
                {...field('delay')}
              />
              <Input
                label="The value to rejecte or resolve with"
                hint={['name="value"']}
                {...field('value')}
              />
            </>
          )}
        </TaskForm>
      </>
    )
  })
  .add('The onSuccessDispatch prop', () => {
    const id = 'Task/Form.onSuccessDispatch-example'
    const successActionType = 'FOOOOOO'
    return (
      <>
        <p>
          Example of a TaskForm which dispatches the "{successActionType}" when
          the task resolves.
        </p>
        <TaskForm
          name="Dummy form task"
          id={id}
          validators={VALIDATORS}
          taskErrorToErrors={(e) => e}
          onSuccessDispatch={successActionType}
        >
          {(field) => (
            <>
              <Radios
                label="Should the task resolve or reject?"
                id={`${id}.resolveOrReject`}
                hint={['name="resolveOrReject"']}
                options={{
                  Resolve: { value: 'resolve' },
                  Reject: { value: 'reject' },
                }}
                {...field('resolveOrReject')}
              />
              <Input
                defaultValue="1000"
                label="Task delay in milliseconds"
                hint={['name="delay"']}
                {...field('delay')}
              />
              <Input
                label="The value to rejecte or resolve with"
                hint={['name="value"']}
                {...field('value')}
              />
            </>
          )}
        </TaskForm>
      </>
    )
  })
  .add('Three steps', () => {
    const id = 'Task/Form.three-steps-example'
    return (
      <TaskForm name="Dummy form task" id={id} validators={VALIDATORS}>
        {(field) => (
          <Radios
            label="Should the task resolve or reject?"
            id={`${id}.resolveOrReject`}
            hint={['name="resolveOrReject"']}
            options={{
              Resolve: { value: 'resolve' },
              Reject: { value: 'reject' },
            }}
            {...field('resolveOrReject')}
          />
        )}
        {(field) => (
          <Input
            defaultValue="1000"
            label="Task delay in milliseconds"
            hint={['name="delay"']}
            {...field('delay')}
          />
        )}
        {(field) => (
          <Input
            label="The value to rejecte or resolve with"
            hint={['name="value"']}
            {...field('value')}
          />
        )}
      </TaskForm>
    )
  })
  .add('The onSuccessRender prop', () => {
    const id = 'Task/Form.onSuccessRender-example'
    return (
      <>
        <p>
          Example of a TaskForm which renders the component passed to its
          "onSuccessRender" prop, The component will be passed the resolved
          value as a "result" prop.
        </p>
        <TaskForm
          name="Dummy form task"
          id={id}
          validators={VALIDATORS}
          taskErrorToErrors={(e) => e}
          onSuccessRender={({ result }) => (
            <>
              <h1>Form was submitted successfully</h1>
              <p>Task resolved with: "{result}"</p>
            </>
          )}
        >
          {(field) => (
            <>
              <Radios
                label="Should the task resolve or reject?"
                id={`${id}.resolveOrReject`}
                hint={['name="resolveOrReject"']}
                options={{
                  Resolve: { value: 'resolve' },
                  Reject: { value: 'reject' },
                }}
                {...field('resolveOrReject')}
              />
              <Input
                defaultValue="1000"
                label="Task delay in milliseconds"
                hint={['name="delay"']}
                {...field('delay')}
              />
              <Input
                label="The value to rejecte or resolve with"
                hint={['name="value"']}
                {...field('value')}
              />
            </>
          )}
        </TaskForm>
      </>
    )
  })
