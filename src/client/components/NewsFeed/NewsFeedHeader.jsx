import React from 'react'

import styled from 'styled-components'

const StyledHeader = styled('h2')`
  background-color: #f8f8f8;
  padding: 10px;
  margin: 5px 0 5px;
`

const NewsFeedHeader = () => {
  return <StyledHeader>Newsfeed - Australia</StyledHeader>
}

export default NewsFeedHeader
