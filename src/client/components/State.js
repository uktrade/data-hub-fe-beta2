import React from 'react'
import { connect } from 'react-redux'

export default connect((state) => ({ state }))(
  ({ state, children: Children }) => <Children {...state} />
)
