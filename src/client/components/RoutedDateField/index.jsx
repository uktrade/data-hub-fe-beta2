import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { get } from 'lodash'

import DateField from '../DateField'

const RoutedDateField = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const qsParams = qs.parse(location.search.slice(1))

      return (
        <DateField
          {...props}
          onChange={(e) => {
            history.push({
              search: qs.stringify({
                ...qsParams,
                [qsParamName]: e.target.value,
                page: 1,
              }),
            })
          }}
          initialValue={get(qsParams, qsParamName, '')}
        />
      )
    }}
  </Route>
)

export default RoutedDateField
