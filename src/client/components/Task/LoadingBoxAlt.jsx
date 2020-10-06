import React from 'react'
import LoadingBox from '@govuk-react/loading-box'

import Task from '.'

// TODO: Doesn't seem to be used anywhere, remove?
export default ({ name, id, ...props }) => (
  <Task>
    {(getTask) => (
      <LoadingBox {...props} loading={getTask(name, id).progress} />
    )}
  </Task>
)
