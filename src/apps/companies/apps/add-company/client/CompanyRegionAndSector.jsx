/* eslint-disable camelcase */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Step, FieldSelect } from '../../../../../client/components'
import { TaskStatus } from '../../../../../client/components/Task'
import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'
import { ID, TASK_POSTCODE_TO_REGION } from './state'

function CompanyRegionAndSector({ regions, region, sectors, isUK, postcode }) {
  return (
    <Step name="companyRegionAndSector" forwardButton="Add company">
      {isUK && (
        <TaskStatus
          name={TASK_POSTCODE_TO_REGION}
          id={ID}
          startOnRender={{
            payload: postcode,
            onSuccessDispatch: ADD_COMPANY__REGION_LOADED,
          }}
        >
          {() => (
            <FieldSelect
              key={region?.value}
              name="uk_region"
              label="DIT region"
              initialValue={region?.value}
              emptyOption="-- Select DIT region --"
              options={regions}
              required="Select DIT region"
            />
          )}
        </TaskStatus>
      )}

      <FieldSelect
        name="sector"
        label="DIT sector"
        emptyOption="-- Select DIT sector --"
        options={sectors}
        required="Select DIT sector"
      />
    </Step>
  )
}

CompanyRegionAndSector.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isUK: PropTypes.bool.isRequired,
}

export default connect(
  ({ addCompany }, { regions, sectors, isUK, postcode }) => {
    const { region } = addCompany
    return {
      regions,
      region,
      sectors,
      isUK,
      postcode,
    }
  }
)(CompanyRegionAndSector)
