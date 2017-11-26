const { zipWith, get, isArray, isString } = require('lodash')
const { getAdvisers } = require('../../../adviser/repos')
const { updateInvestmentTeamMembers } = require('../../repos')
const { teamMembersLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

// Transform the form posted to an array of objects to save
// and filter out any blanks
function transformDataToTeamMemberArray (body) {
  let teamMembers = []
  if (isArray(body.adviser)) {
    teamMembers = zipWith(body.adviser, body.role, (adviser, role) => ({ adviser, role }))
  } else if (isString(body.adviser)) {
    teamMembers = [{ adviser: body.adviser, role: body.role }]
  }
  return teamMembers.filter(member => member.adviser.length)
}

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData
    const advisersResponse = await getAdvisers({ token: req.session.token })
    const advisers = advisersResponse.map(transformObjectToOption)

    const teamMembers = investmentData.team_members.map((teamMember) => ({
      adviser: teamMember.adviser.id,
      role: teamMember.role,
    }))

    // Add an extra blank record to allow user to add a team member
    teamMembers.push({
      adviser: null,
      role: null,
    })

    res.locals.form = Object.assign({}, res.locals.form, {
      labels: teamMembersLabels.edit,
      state: {
        teamMembers,
      },
      options: {
        advisers,
      },
      buttonText: 'Save',
      returnLink: `/investment-projects/${investmentData.id}/team`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

async function handleFormPost (req, res, next) {
  try {
    res.locals.projectId = req.params.investmentId
    const teamMembers = transformDataToTeamMemberArray(req.body)
    await updateInvestmentTeamMembers(req.session.token, req.params.investmentId, teamMembers)
    next()
  } catch (err) {
    if (err.statusCode === 400) {
      const teamMembers = transformDataToTeamMemberArray(req.body)
      const roleError = get(err, 'error.role')
      let messages = {}
      if (roleError) {
        teamMembers.forEach((item, i) => {
          if (item.role === '') {
            messages['role-' + i] = roleError
          }
        })
      }
      res.locals.form = Object.assign({}, res.locals.form, {
        errors: { messages },
        state: { teamMembers },
      })

      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
  transformDataToTeamMemberArray,
}
