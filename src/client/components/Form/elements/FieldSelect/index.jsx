import React from 'react'
import PropTypes from 'prop-types'
import Select from '@govuk-react/select'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const FieldSelect = ({
  name,
  label,
  legend,
  hint,
  validate,
  required,
  initialValue,
  options,
  emptyOption,
  ...rest
}) => {
  const { error, touched, value, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  //console.log("FIELDSELECT VALUE")
  //console.log(JSON.stringify(value))
  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <Select
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        meta={{ error, touched }}
        input={{
          id: name,
          defaultValue: value,
          //value,
          ...rest,
        }}
      >
        {emptyOption && (
          <option key="" value="">
            {emptyOption}
          </option>
        )}
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </Select>
      {options.find((o) => o.value === value)?.children}
    </FieldWrapper>
  )
}

FieldSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  initialValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  emptyOption: PropTypes.string,
}

FieldSelect.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: '',
  options: [],
  emptyOption: 'Please select',
}

export default FieldSelect
