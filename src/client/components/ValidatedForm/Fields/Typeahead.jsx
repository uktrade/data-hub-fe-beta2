/* eslint-disable */
import React from 'react'
import styled from 'styled-components'

import ReactSelectGovUK from '../../ReactSelect/GovUK'

import commonPropTypes from './common-prop-types'

const Label = styled.label(({error}) => ({
  display: 'flex',
  fontFamily: '"nta",Arial,sans-serif',
  '-webkit-font-smoothing': 'antialiased',
  flexDirection: 'column',
  boxSizing: 'border-box',
  marginRight: 15,
  marginBottom: 0,
  ...error
    ? {
        borderLeft: '4px solid #d4351c',
        paddingLeft: 10,
      }
    : {},
}))

const LabelText = styled.span({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.25,
  color: '#0b0c0c',
  paddingBottom: 2,
  marginBottom: 0,
})

const Hint = styled.span({
  marginBottom: 15,
  color: '#6f777b',
})

const Err = styled.span({
  marginBottom: 15,
  fontWeight: 700,
  color: '#d4351c',
})

const Field = ({label, hint, error, children}) =>
  <Label error={error}>
    <LabelText>{label}</LabelText>
    {hint && <Hint>{hint}</Hint>}
    {error && <Err>{error}</Err>}
    {children}
  </Label>

const TypeaheadField = ({
  label, hint, error,
  ...props
}) =>
  <Field {...{label, hint, error}}>
    <ReactSelectGovUK {...props}/>
  </Field>

TypeaheadField.propTypes = {
  ...ReactSelectGovUK.propTypes,
  ...commonPropTypes,
}

export default TypeaheadField
