import React from 'react'
import GovukSelect from '@govuk-react/select'

const Select = ({ error, options, defaultValue, containerProps, ...props }) => (
  <GovukSelect
    {...containerProps}
    meta={{ touched: true, error }}
    input={{ ...props, defaultValue }}
  >
    {Object.entries(options).map(([label, value]) => (
      <option key={label} value={value}>
        {label}
      </option>
    ))}
  </GovukSelect>
)

export default Select
