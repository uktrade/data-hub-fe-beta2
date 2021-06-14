import PropTypes from 'prop-types'
import React from 'react'
import GovukSelect from '@govuk-react/select'

import { SELECT_FIELD__SET_VALUE } from '../../../actions'
import multiInstance from '../../../utils/multiinstance'

import commonPropTypes from './common-prop-types'

const SelectField = ({
  error,
  options = {},
  containerProps,
  label,
  hint,
  placeholder = '--- Choose an option ---',
  defaultValue = '',
  onChange,
  // State props
  value,
  dispatch,
  ...props
}) => (
  <GovukSelect
    {...containerProps}
    hint={hint}
    label={label}
    meta={{ touched: true, error }}
    input={{
      ...props,
      ...(value === undefined ? { defaultValue } : { value }),
      onChange: (e) => {
        dispatch({ type: SELECT_FIELD__SET_VALUE, value: e.target.value })
        onChange(e)
      },
    }}
  >
    <option disabled={true} value="">
      {placeholder}
    </option>
    {Object.entries(options).map(([label, value]) => (
      <option key={label} value={value}>
        {label}
      </option>
    ))}
  </GovukSelect>
)

SelectField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.objectOf(PropTypes.string).isRequired,
  hint: PropTypes.node,
}

export default multiInstance({
  name: 'NewForm/Fields/Select',
  reducer: (state, { value }) => ({ value }),
  actionPattern: SELECT_FIELD__SET_VALUE,
  component: SelectField,
})
