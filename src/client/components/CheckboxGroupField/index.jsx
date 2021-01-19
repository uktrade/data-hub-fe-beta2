import React, { useState, useEffect } from 'react'
import MultiChoice from '@govuk-react/multi-choice'
import { GREY_2, YELLOW } from 'govuk-colours'
import styled from 'styled-components'

import Checkbox from '../Checkbox'
import FieldWrapper from '../Form/elements/FieldWrapper'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: normal;
    margin-bottom: 4px;
  }
  label:not(:first-child) {
    padding-left: 20px;
  }
  input {
    /* left: -10px;
    top: -2px; */
    + span {
      padding: 10px 15px 5px;
      &::before {
        top: 8px;
        width: 24px;
        height: 24px;
      }
      &::after {
        top: 14px;
        left: 5px;
        width: 10px;
        height: 4.5px;
        border-width: 0 0 3px 3px;
      }
    }
    &:hover {
      + span {
        &::before {
          outline: 10px solid ${GREY_2};
        }
      }
    }
    &:focus {
      + span {
        &::before {
          box-shadow: 0 0 0 4px ${YELLOW};
        }
      }
    }
  }
`

/**
 * Check box group field - shows a number of options as checkboxes
 *
 * @param {string} legend - legend label to display
 * @param {string} name - field name for the group
 * @param {string} hint - hint to display
 * @param {Array} options - the available options as objects with label and value
 * @param {Func} loadOptions - function to load options
 * @param {Array} selectedOptions - the options that have been selected
 * @param {Func} onChange - callback function that passes on the selected options
 */
const CheckboxGroupField = ({
  legend,
  name,
  hint,
  options: initialOptions = [],
  loadOptions = null,
  selectedOptions = [],
  onChange = () => null,
  ...props
}) => {
  const [options, setOptions] = useState(initialOptions)
  const [loading, setLoading] = useState(loadOptions !== null)

  useEffect(() => {
    if (loadOptions !== null) {
      loadOptions().then((options) => {
        setLoading(false)
        setOptions(options)
      })
    }
  }, [options, loadOptions])

  return (
    <StyledFieldWrapper
      legend={legend}
      name={name}
      hint={hint}
      data-test={`checkbox-group-field-${name}`}
      {...props}
    >
      {loading ? (
        'Loading...'
      ) : (
        <MultiChoice>
          {options.map((option) => {
            const {
              value: optionValue,
              label: optionLabel,
              ...optionProps
            } = option
            const checked = selectedOptions
              .map(({ value }) => value)
              .includes(optionValue)
            const otherOptions = [
              ...selectedOptions.filter(
                ({ value: otherOptionValue }) =>
                  otherOptionValue !== optionValue
              ),
            ]
            const handleChange = (event) => {
              if (event.target.checked) {
                onChange([...otherOptions, option])
              } else {
                onChange(otherOptions)
              }
            }
            return (
              <Checkbox
                key={optionValue}
                name={name}
                initialChecked={checked}
                value={optionValue}
                onChange={handleChange}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
              </Checkbox>
            )
          })}
        </MultiChoice>
      )}
    </StyledFieldWrapper>
  )
}

export default CheckboxGroupField
