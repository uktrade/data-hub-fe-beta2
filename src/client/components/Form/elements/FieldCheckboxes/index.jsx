import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@govuk-react/checkbox'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'
import { WHITE } from 'govuk-colours'

import { BODY_SIZES } from '@govuk-react/constants'

import useField from '../../hooks/useField'
import FieldWrapper from '../FieldWrapper'
import { useFormContext } from '../../hooks'

const StyledDiv = styled('div')`
  ${(props) =>
    props.reduced &&
    `
    background-color: ${WHITE};
    margin: 0 -4px;
    `}
`

const StyledCheckbox = styled(Checkbox)`
  ${(props) =>
    props.reduced &&
    `
      padding: 8px 0 8px 33px !important;
      min-height: auto;
      margin-bottom: 1px;

      input {
        width: 18px;
        height: 18px;
      }
      input + span {
        padding: 0;
        &:before {
          margin: 8px 0 0 8px;
          height: 18px;
          width: 18px;
          border-width: 1px;
        }
        &:after{
          border-width: 0 0 2px 2px;
          width: 10px;
          height: 5px;
          left: 11px;
        }
      }
      input + span + span {
        padding-left: 0;
        font-size: ${BODY_SIZES.S}px;
      }
    `}
`

const FieldCheckboxes = ({
  name,
  validate,
  required,
  label,
  legend,
  bigLegend,
  hint,
  options,
  initialValue,
  reduced,
  reducedPadding,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  const { setFieldValue } = useFormContext()

  const onChange = (e) => {
    const { name: optionName, checked } = e.target
    let newValue = Array.isArray(value) ? [...value] : []

    if (checked) {
      newValue.push(optionName)
    } else if (newValue.includes(optionName)) {
      newValue = newValue.filter((item) => item !== optionName)
    }

    setFieldValue(name, newValue)
  }

  return (
    <FieldWrapper
      {...{
        ...props,
        name,
        label,
        legend,
        bigLegend,
        hint,
        error,
        reduced,
        reducedPadding,
      }}
    >
      <MultiChoice meta={{ error, touched }} reduced={reduced}>
        {options.map(
          ({
            value: optionValue,
            label: optionLabel,
            children,
            ...optionProps
          }) => (
            <StyledDiv key={optionValue} reduced={reduced}>
              <StyledCheckbox
                key={optionValue}
                name={optionValue}
                checked={value.includes(optionValue)}
                onChange={onChange}
                onBlur={onBlur}
                reduced={reduced}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
              </StyledCheckbox>

              {value.includes(optionValue) && !!children ? children : null}
            </StyledDiv>
          )
        )}
      </MultiChoice>
    </FieldWrapper>
  )
}

FieldCheckboxes.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  initialValue: PropTypes.arrayOf(PropTypes.string),
  reduced: PropTypes.bool,
  reducedPadding: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      children: PropTypes.node,
    })
  ),
}

FieldCheckboxes.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: [],
  options: [],
  reduced: false,
  reducedPadding: false,
}

export default FieldCheckboxes
