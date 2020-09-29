import React from 'react'
import { storiesOf } from '@storybook/react'

import NewsFeed from 'NewsFeed'

storiesOf('Newsfeed', module)
  .addParameters({
    options: { theme: undefined },
    // readme: {
    //   content: exampleReadme,
    //   sidebar: usageReadme,
    // },
  })
  .add('Default', () => (
    <NewsFeed />
  ))
