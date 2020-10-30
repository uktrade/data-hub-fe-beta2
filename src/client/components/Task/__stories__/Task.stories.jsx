import React from 'react'
import { storiesOf } from '@storybook/react'

import Task from '..'

storiesOf('Task', module).add('Cancelation', () => (
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
