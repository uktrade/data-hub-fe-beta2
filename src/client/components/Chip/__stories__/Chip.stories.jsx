import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Chip from '../'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

storiesOf('Chips', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => {
    return (
      <div>
        <Chip value="apple">Apple</Chip>
      </div>
    )
  })
  .add('Clickable', () => {
    return (
      <div>
        <Chip value="apple" onClick={action('Clicked')}>
          Apple
        </Chip>
      </div>
    )
  })
