import _ from 'lodash'
import React from 'react'

import Countries from '../../Resource/Countries'
import FieldSelect from './FieldSelect'

const FieldCountrySelect = (props) => (
  <Countries>
    {(countries) => (
      <FieldSelect
        label="Country"
        {...props}
        options={countries.map(({ name, id }) => ({ label: name, value: id }))}
      />
    )}
  </Countries>
)

FieldCountrySelect.propTypes = _.omit(FieldSelect.propTypes, 'options')

export default FieldCountrySelect
