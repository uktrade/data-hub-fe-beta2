import React from 'react'
import { connect } from 'react-redux'
import Task from '../../../../../client/components/Task'
import { ID as STATE_ID, TASK_UPDATE_INTERACTIONS, state2props } from './state'

const List = ({ interactions }) => {
  return (
    <Task.Status
      name={TASK_UPDATE_INTERACTIONS}
      id={STATE_ID}
      progressMessage="loading interactions"
      startOnRender={{
        payload: 'payload',
        onSuccessDispatch: TASK_UPDATE_INTERACTIONS,
        STATE_ID,
      }}
    >
      {() => (
        <>
          {interactions.map((interaction, i) => (
            <div key={i}>
              <div>Company {interaction.company.name}</div>
              <div>
                Advisers {interaction?.dit_participants[0]?.adviser.name}
              </div>
            </div>
          ))}
        </>
      )}
    </Task.Status>
  )
}

export default connect(state2props, null)(List)
