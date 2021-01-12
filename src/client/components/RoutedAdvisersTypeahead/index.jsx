import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'

import Task from '../Task'

import { parseAdviserData } from '../../../common/formatAdviser'

const fetchAdvisers = (onlyShowActiveAdvisers) => {
  return throttle(
    (searchString) =>
      axios
        .get(`${process.env.GATSBY_API_PROXY_BASE_URL}/api-proxy/adviser/`, {
          params: {
            autocomplete: searchString,
            is_active: onlyShowActiveAdvisers,
          },
        })
        .then(({ data: { results } }) => parseAdviserData(results)),
    500
  )
}

const RoutedAdvisersTypeahead = ({
  taskProps,
  onlyShowActiveAdvisers = true,
  loadOptions = fetchAdvisers(onlyShowActiveAdvisers),
  ...props
}) => (
  <Task.Status {...taskProps}>
    {() => <RoutedTypeahead loadOptions={loadOptions} {...props} />}
  </Task.Status>
)

RoutedAdvisersTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default RoutedAdvisersTypeahead
