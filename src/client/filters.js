import { format } from './utils/date-utils'

const getDateLabel = (value) => (value ? `${format(value, 'd MMMM yyyy')}` : '')

export const buildOptionsFilter = ({
  options = [],
  value = [],
  categoryLabel = '',
}) => {
  const optionsFilter = options.filter((option) => value.includes(option.value))
  if (categoryLabel) {
    return optionsFilter.map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))
  } else {
    return optionsFilter
  }
}

export const buildInputFieldFilter = ({ value, categoryLabel }) =>
  value ? [{ value, label: value, categoryLabel }] : []

export const buildDatesFilter = ({ value, categoryLabel = '' }) =>
  value ? [{ label: getDateLabel(value), value, categoryLabel }] : []
