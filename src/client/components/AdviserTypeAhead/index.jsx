import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'
import { FieldTypeahead } from '../../../client/components'
import { parseAdviserData } from '../../../common/formatAdviser'

const AdviserTypeAhead = ({
  name,
  label,
  required,
  isMulti,
  onlyShowActiveAdvisers = true,
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder="-- Select adviser --"
      noOptionsMessage={() => 'Type to search for advisers'}
      required={required}
      loadOptions={throttle(
        (searchString) =>
          axios
            .get('/api-proxy/adviser/', {
              params: {
                autocomplete: searchString,
                is_active: onlyShowActiveAdvisers,
              },
            })
            .then(({ data: { results } }) => parseAdviserData(results)),
        500
      )}
      isMulti={isMulti}
      {...props}
    />
  )
}

AdviserTypeAhead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
}

export default AdviserTypeAhead
