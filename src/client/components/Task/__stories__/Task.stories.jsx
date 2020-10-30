import React from 'react'
import { storiesOf } from '@storybook/react'

import Task from '..'

storiesOf('Task', module)
  .add('Cancellation', () => (
    <Task>
      {(task) => (
        <ul>
          {['a', 'b', 'c'].map((id) => {
            const t = task('Task cancellation demo', id)
            const startOptions = { payload: id, onSuccessDispatch: `DONE-${id}` }
            return (
              <li key={id}>
                id: {id}{' '}
                <button
                  disabled={t.progress}
                  onClick={() => t.start(startOptions)}
                >
                  start
                </button>
                <button
                  onClick={() => {
                    t.cancel()
                    t.start(startOptions)
                  }}
                >
                  restart
                </button>
                <button disabled={!t.progress} onClick={() => t.cancel()}>
                  cancel
                </button>{' '}
                status: {t.status}
              </li>
            )
          })}
        </ul>
      )}
    </Task>
  ))
  .add('TaskForm', () => (
    <TaskForm
      name="Dummy form task"
      id="task-form-demo"
      taskErrorToErrors={(e) => e}
      // onSuccessDispatch="DUMMY_FORM_TASK_SUCCESS"
      onSuccess={(result) => alert(`Success:\n${JSON.stringify(result)}`)}
      valuesToPayload={({ rejectValue, delay, ...values }) => ({
        ...values,
        rejectValue: rejectValue && JSON.parse(rejectValue),
        delay: parseInt(delay, 10),
      })}
      validators={{
        foo: (v) => v.length > 3 || Error('Foo must be at least 4 characters'),
        bar: (v) =>
          v === 'invalid' && Error('Bar must not be the "invalid" option'),
        delay: (v) =>
          isNaN(parseInt(v, 10)) && Error('Delay must be a valid number'),
        resolveOrReject: (v) => v || Error('Choose success or error'),
        resolveValue: () => {},
        rejectValue: (v, { resolveOrReject }) => {
          if (resolveOrReject !== 'reject') return
          try {
            if (!_.isPlainObject(JSON.parse(v))) {
              return Error('Reject value must be an object!')
            }
          } catch (e) {
            return Error('Reject value must be valid JSON!')
          }
        },
      }}
    >
      {(field) => (
        <>
          <Radios
            {...field('resolveOrReject')}
            hint={['name="resolveOrReject"']}
            label="Should the task succeed or fail?"
            defaultValue="bar"
            id="task-form-demo"
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
              Fail: {
                value: 'reject',
                inset: (
                  <Textarea
                    {...field('rejectValue')}
                    label="Reject value"
                    defaultValue='{"foo": "Foo failed in task", "bar": "Bar failed as well"}'
                    defaultValue={JSON.stringify(
                      {
                        foo: 'Foo task error',
                        bar: 'Bar task error',
                      },
                      null,
                      2
                    )}
                  />
                ),
              },
            }}
          />
          <Input
            {...field('delay')}
            defaultValue="1000"
            label="Task delay in milliseconds"
            hint={['name="delay"']}
          />
          <Input {...field('foo')} label="Foo" hint={['name="foo"']} />
          <Select
            {...field('bar')}
            label="Bar"
            hint={['name="bar"']}
            options={{
              Bar: 'bar',
              Bing: 'bing',
              Invalid: 'invalid',
            }}
          />
        </>
      )}
    </TaskForm>
  ))
