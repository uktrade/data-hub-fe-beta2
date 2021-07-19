import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'
import Task from '../Task'
import urls from '../../../lib/urls'

const parseTeamData = (teams) =>
  teams
    .filter((team) => team.name && team.name.trim().length)
    .map(({ id, name }) => ({
      label: name,
      value: id,
    }))

const fetchTeams = () => {
  return throttle(
    (searchString) =>
      axios
        .get(urls.metadata.team(), {
          params: {
            autocomplete: searchString,
          },
        })
        .then(({ data }) => parseTeamData(data)),
    500
  )
}

const RoutedTeamsTypeahead = ({
  taskProps,
  loadOptions = fetchTeams(),
  ...props
}) => (
  <Task.Status {...taskProps}>
    {() => <RoutedTypeahead loadOptions={loadOptions} {...props} />}
  </Task.Status>
)

RoutedTeamsTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default RoutedTeamsTypeahead
