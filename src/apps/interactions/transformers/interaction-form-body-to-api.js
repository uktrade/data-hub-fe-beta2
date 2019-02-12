const { omit } = require('lodash')

const castCompactArray = require('../../../lib/cast-compact-array')
const { transformDateObjectToDateString } = require('../../transformers')

function transformInteractionFormBodyToApiRequest (props) {
  const policyAreasArray = castCompactArray(props.policy_areas)
  const policyIssueTypesArray = castCompactArray(props.policy_issue_types)
  const contactTypesArray = castCompactArray(props.contacts)

  return omit({
    ...props,
    date: transformDateObjectToDateString('date')(props),
    grant_amount_offered: props.grant_amount_offered || null,
    net_company_receipt: props.net_company_receipt || null,
    contacts: contactTypesArray,
    policy_areas: policyAreasArray,
    policy_issue_types: policyIssueTypesArray,
  }, ['date_day', 'date_month', 'date_year'])
}

module.exports = transformInteractionFormBodyToApiRequest
