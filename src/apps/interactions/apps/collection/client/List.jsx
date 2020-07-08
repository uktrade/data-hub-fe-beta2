import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Task from '../../../../../client/components/Task'
import { TASK_UPDATE__INTERACTIONS } from '../../../../../client/actions'
import { ID as STATE_ID, state2props } from './state'

const StyledRoot = styled('div')`
  header {
    padding: 8px 0;
    border-bottom: 5px solid #0b0c0c;
    .header__count {
      font-size: 24px;
      line-height: 32px;
      span {
        font-size: 36px;
        font-weight: 600;
        line-height: 1;
      }
    }
  }
  .interactions {
    li {
      border-bottom: 1px solid #bfc1c3;
      padding: 16px 0;
      h3 {
        margin: 0;
        a {
          text-decoration: none;
          color: #005ea5;
        }
      }
      div {
        font-size: 16px;
        margin-top: 4px;
        span {
          color: #6f777b;
        }
      }
    }
  }
`

const List = ({ interactions, count, advisers, filters, page }) => {
  return (
    <Task.Status
      name={TASK_UPDATE__INTERACTIONS}
      id={STATE_ID}
      progressMessage="loading interactions"
      startOnRender={{
        payload: { filters, page },
        onSuccessDispatch: TASK_UPDATE__INTERACTIONS,
        STATE_ID,
      }}
    >
      {() => (
        <StyledRoot>
          <header>
            <div className="header__count">
              <span>{count}</span> interactions
            </div>
            <div className="adviser">
              {advisers &&
                advisers.map((adviser) => (
                  <>
                    <span className="adviser__label">Adviser(s)</span>{' '}
                    <span className="adviser__name">{adviser}</span>
                  </>
                ))}
            </div>
          </header>
          {interactions && (
            <ol className="interactions">
              {interactions.map((interaction, i) => (
                <li key={i}>
                  <h3>
                    <a href={`/interactions/${interaction.id}`}>
                      {interaction.subject}
                    </a>
                  </h3>
                  <div>
                    <span>Company</span> {interaction.company.name}
                  </div>
                  <div>
                    <span>Advisers</span>{' '}
                    {interaction?.dit_participants[0]?.adviser.name}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </StyledRoot>
      )}
    </Task.Status>
  )
}

export default connect(state2props)(List)
