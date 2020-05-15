import React from 'react'
import { connect } from 'react-redux'

import Task from '../Task'
import { state2props, ID as STATE_ID, TASK_GET_PIPELINE_LIST } from './state'
import { PIPELINE__LIST_LOADED } from '../../actions'
import PipelineItem from './PipelineItem'

const PipelineList = ({ status, items }) => {
  return (
    <Task.Status
      name={TASK_GET_PIPELINE_LIST}
      id={STATE_ID}
      progressMessage="loading pipelines items"
      startOnRender={{
        payload: { status },
        onSuccessDispatch: PIPELINE__LIST_LOADED,
      }}
    >
      {() =>
        items?.map((item) => (
          <PipelineItem
            key={item.id}
            companyId={item.company.id}
            companyName={item.company.name}
            projectName={item.name}
            date={item.created_on}
          />
        ))
      }
    </Task.Status>
  )
}

export default connect(state2props)(PipelineList)
