import React from 'react'
import GovukSelect from '@govuk-react/select'

import multiInstance from '../../../utils/multiinstance'

const Select = ({
  error,
  options = {},
  defaultValue,
  containerProps,
  label,
  hint,
  placeholder = '--- Choose an option ---',
  defalutValue,
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
      defaultValue,
      onChange: (e) => {
        dispatch({ type: 'SELECT_FIELD__SET_VALUE', value: e.target.value })
        onChange(e)
      },
    }}
  >
    <option disabled={true} selected={!defaultValue} value="">
      {placeholder}
    </option>
    {Object.entries(options).map(([label, v]) => (
      <option
        key={label}
        value={v}
        selected={v === value}
        defaultSelected={v === defaultValue}
      >
        {label}
      </option>
    ))}
  </GovukSelect>
)

// TODO: Add propTypes

export default multiInstance({
  name: 'NewForm/Fields/Select',
  reducer: (state, { value }) => ({ value }),
  actionPattern: 'SELECT_FIELD__SET_VALUE',
  component: Select,
})
