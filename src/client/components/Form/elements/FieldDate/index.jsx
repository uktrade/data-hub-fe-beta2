import React from 'react'
import PropTypes from 'prop-types'
import { castArray } from 'lodash'
import styled from 'styled-components'
import { ERROR_COLOUR } from 'govuk-colours'
import ErrorText from '@govuk-react/error-text'
import Label from '@govuk-react/label'
import Input from '@govuk-react/input'
import LabelText from '@govuk-react/label-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'

import FieldWrapper from '../FieldWrapper'
import useField from '../../hooks/useField'
import { useFormContext } from '../../hooks'
import {
  isNormalisedDateValid,
  isShortDateValid,
} from '../../../../utils/date-utils'

const DAY = 'day'
const MONTH = 'month'
const YEAR = 'year'
const FORMAT_LONG = 'LONG'

const StyledInputWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
`

const StyledLabel = styled(Label)(
  {
    marginRight: '20px',
    marginBottom: 0,
  },
  ({ year }) => ({
    width: year ? '70px' : '50px',
  })
)

const StyledList = styled('div')({
  display: 'flex',
})

const getValidator =
  (required, format) =>
  ({ day, month, year }) => {
    const isLong = format === FORMAT_LONG
    const isValid = isLong
      ? isNormalisedDateValid(year, month, day)
      : isShortDateValid(year, month)

    const isDateEmpty = isLong ? !day && !month && !year : !month && !year

    return !isValid && (!isDateEmpty || required)
      ? required || 'Enter a valid date'
      : null
  }

const getDefaultInitialValue = (format) => {
  return format === FORMAT_LONG
    ? {
        day: '',
        month: '',
        year: '',
      }
    : { month: '', year: '' }
}

const FieldDate = ({
  name,
  label,
  legend,
  hint,
  validate,
  initialValue,
  labels,
  required,
  format,
  reduced,
  isIE,
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    initialValue: initialValue || getDefaultInitialValue(format),
    validate: [getValidator(required, format), ...castArray(validate)],
  })

  const { setFieldValue } = useFormContext()

  const onChange = (valueKey, e) => {
    const date = e.target.value.split('-')
    reduced
      ? setFieldValue(name, {
          ...value,
          day: date[2],
          month: date[1],
          year: date[0],
        })
      : setFieldValue(name, {
          ...value,
          [valueKey]: e.target.value,
        })
  }

  return (
    <FieldWrapper {...{ name, label, legend, hint, error, reduced, isIE }}>
      <StyledInputWrapper error={error}>
        {error && <ErrorText>{error}</ErrorText>}
        {reduced ? (
          <Input
            id={name}
            name={name}
            error={touched && error}
            type="date"
            value={`${value.year}-${value.month}-${value.day}`}
            onChange={(e) => onChange(name, e)}
            onBlur={onBlur}
          />
        ) : (
          <StyledList>
            {format === FORMAT_LONG && (
              <StyledLabel>
                <LabelText>{labels.day}</LabelText>
                <Input
                  id={`${name}.day`}
                  name={`${name}.day`}
                  error={touched && error}
                  type="number"
                  value={value.day}
                  onChange={(e) => onChange(DAY, e)}
                  onBlur={onBlur}
                />
              </StyledLabel>
            )}
            <StyledLabel>
              <LabelText>{labels.month}</LabelText>
              <Input
                id={`${name}.month`}
                name={`${name}.month`}
                error={touched && error}
                type="number"
                value={value.month}
                onChange={(e) => onChange(MONTH, e)}
                onBlur={onBlur}
              />
            </StyledLabel>
            <StyledLabel year={true}>
              <LabelText>{labels.year}</LabelText>
              <Input
                id={`${name}.year`}
                name={`${name}.year`}
                error={touched && error}
                type="number"
                value={value.year}
                onChange={(e) => onChange(YEAR, e)}
                onBlur={onBlur}
              />
            </StyledLabel>
          </StyledList>
        )}
      </StyledInputWrapper>
    </FieldWrapper>
  )
}

FieldDate.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.string,
  required: PropTypes.string,
  format: PropTypes.string,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  initialValue: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
  }),
  labels: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
  }),
  reduced: PropTypes.bool,
  isIE: PropTypes.bool,
}

FieldDate.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  required: null,
  validate: null,
  format: FORMAT_LONG,
  initialValue: null,
  labels: {
    day: 'Day',
    month: 'Month',
    year: 'Year',
  },
  reduced: false,
  isIE: false,
}

export default FieldDate
