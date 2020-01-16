const { pick, get } = require('lodash')
const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../config')

function fetchRawCompanyListItems(token, id) {
  return authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list/${id}/item`,
  })
}

const fetchRawCompanyList = (token) =>
  authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list`,
  })

const transformRawCompany = ({ latest_interaction, company }) => ({
  company: pick(company, ['id', 'name']),
  latestInteraction: pick(latest_interaction, ['date', 'id', 'subject']),
  ditParticipants: latest_interaction
    ? latest_interaction.dit_participants.map((participant) => ({
        name: get(participant, 'adviser.name'),
        team: get(participant, 'team.name'),
      }))
    : [],
})

const fetchCompanyLists = (token) =>
  fetchRawCompanyList(token).then(({ results }) =>
    Promise.all(
      results.map((list) =>
        fetchRawCompanyListItems(token, list.id).then(({ results }) => ({
          ...pick(list, ['id', 'name']),
          companies: results.map(transformRawCompany),
        }))
      )
    )
  )

module.exports = {
  fetchCompanyLists,
}
