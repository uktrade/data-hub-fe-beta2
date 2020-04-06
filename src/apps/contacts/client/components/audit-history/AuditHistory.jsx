import React from 'react'
import { connect } from 'react-redux'
import { AUDIT_HISTORY__LOADED } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task/index.jsx'
import { state2props, ID, TASK_NAME } from './state'

const AuditHistory = ({ auditHistory }) => {
  return (
    <Task.Status
      name={TASK_NAME}
      id={ID}
      progressMessage="Audit History"
      startOnRender={{
        onSuccessDispatch: AUDIT_HISTORY__LOADED,
      }}
    >
      {() =>
        auditHistory && (
          <pre>
            <code>{JSON.stringify(auditHistory, null, 2)}</code>
          </pre>
        )
      }
    </Task.Status>
  )
}

export default connect(state2props, null)(AuditHistory)
