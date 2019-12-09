const { get } = require('lodash')
const { getOneListGroupCoreTeam } = require('../../../repos')
const config = require('../../../../../config')
const { transformCoreTeamToCollection } = require('../../../transformers')
const { coreTeamLabels } = require('../../../labels')
const { isItaTierDAccount } = require('../../../../../lib/is-tier-type-company')
const { companies } = require('../../../../../../src/lib/urls')
const { authorisedRequest } = require('../../../../../lib/authorised-request')
const urls = require('../../../../../lib/urls')

const companyToLeadITA = ({ one_list_group_global_account_manager: leadITA }) =>
  leadITA && {
    name: leadITA.name,
    email: leadITA.contact_email,
    team: get(leadITA, 'dit_team.name'),
  }

function renderLeadAdvisers (req, res) {
  const { company, user: { permissions } } = res.locals
  const { name, team, email } = companyToLeadITA(company) || {}

  res
    .breadcrumb(company.name, `${companies.detail(company.id)}`)
    .breadcrumb('Lead adviser')
    .render('companies/views/lead-advisers', {
      props: {
        hasAccountManager: !!company.one_list_group_global_account_manager,
        name,
        team,
        email,
        companyName: company.name,
        companyId: company.id,
        addUrl: companies.advisers.assign(company.id),
        removeUrl: companies.advisers.remove(company.id),
        hasPermissionToAddIta: permissions.includes('company.change_regional_account_manager'),
      },
    })
}

async function renderCoreTeamAdvisers (req, res, next) {
  try {
    const { company } = res.locals
    const token = req.session.token
    const { global_account_manager: globalAccountManager, adviser_on_core_team: adviserOnCoreTeam, location, team } = coreTeamLabels
    const columns = {
      'global_account_manager': {
        team,
        location,
        name: globalAccountManager,
      },
      'adviser_core_team': {
        team,
        location,
        name: adviserOnCoreTeam,
      },
    }
    const coreTeam = await getOneListGroupCoreTeam(token, company.id)
      .then(transformCoreTeamToCollection)
    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        coreTeam,
        columns,
        oneListEmail: config.oneList.email,
        companyName: company.name,
      })
  } catch (error) {
    next(error)
  }
}

async function renderAdvisers (req, res, next) {
  const { company } = res.locals
  isItaTierDAccount(company) || company.one_list_group_tier === null
    ? renderLeadAdvisers(req, res)
    : await renderCoreTeamAdvisers(req, res, next)
}

// istanbul ignore next: Covered by functional tests
const form = (req, res) => {
  const { name, id } = res.locals.company
  const isRemove = req.url === '/remove'
  const currentLeadITA = companyToLeadITA(res.locals.company)
  res
    .breadcrumb(name, urls.companies.detail(id))
    .breadcrumb(
      isRemove
        ? 'Remove the Lead ITA'
        : currentLeadITA
          ? 'Replace the Lead ITA'
          : 'Confirm you are the Lead ITA'
    )
    .render('companies/apps/advisers/views/manage-adviser.njk', {
      props: {
        isRemove,
        currentLeadITA,
        cancelUrl: urls.companies.advisers.index(id),
      },
    })
}

// istanbul ignore next: Covered by functional tests
async function submit (req, res, next) {
  const { company: { id } } = res.locals
  const action = req.url === '/remove'
    ? 'remove'
    : 'self-assign'

  try {
    await authorisedRequest(req.session.token, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company/${id}/${action}-account-manager`,
    })

    req.flash('success', 'Lead adviser information updated')
    res.redirect(urls.companies.advisers.index(id))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
  submit,
  form,
}
