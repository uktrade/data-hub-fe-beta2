const { get, upperFirst, camelCase } = require('lodash')
const format = require('date-fns/format')

const metadata = require('../../../lib/metadata')
const { buildIncompleteFormList, toCompleteStageMessages } = require('../helpers')
const { isValidGuid } = require('../../../lib/controller-utils')
const { getDitCompany } = require('../../companies/repos')
const { getAdviser } = require('../../adviser/repos')
const { getInvestment } = require('../repos')
const { mediumDateTimeFormat } = require('../../../../config')

function getNextStage (currentStage, projectStages) {
  const projectStageIndex = projectStages.findIndex((projectStage) => {
    return projectStage.name.toLowerCase() === currentStage.toLowerCase()
  })
  return projectStages[projectStageIndex + 1]
}

function getCompanyDetails (req, res, next) {
  getDitCompany(req.session.token, req.params.companyId)
    .then((company) => {
      res.locals.company = company
      return next()
    })
    .catch(next)
}

function getInvestmentProjectStages (features) {
  if (features && features['streamlined-investment-flow']) {
    return metadata.investmentProjectStage.filter(stage => stage.exclude_from_investment_flow !== true)
  }
  return metadata.investmentProjectStage
}

async function getInvestmentDetails (req, res, next) {
  const investmentId = req.params.investmentId

  if (!isValidGuid(investmentId)) {
    return next()
  }
  try {
    const investment = await getInvestment(req.session.token, investmentId)
    const investorCompany = await getDitCompany(req.session.token, get(investment, 'investor_company.id'))
    const ukCompanyId = get(investment, 'uk_company.id')
    const clientRelationshipManagerId = get(investment, 'client_relationship_manager.id')
    const stageName = investment.stage.name
    const investmentProjectStages = getInvestmentProjectStages(res.locals.features)

    investment.investor_company = Object.assign({}, investment.investor_company, investorCompany)

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req.session.token, ukCompanyId)
      investment.uk_company = Object.assign({}, investment.uk_company, companyDetails)
    }

    if (clientRelationshipManagerId) {
      const clientRelationshipManager = await getAdviser(req.session.token, clientRelationshipManagerId)
      investment.client_relationship_manager = clientRelationshipManager
    }

    res.locals.investment = investment
    res.locals.equityCompany = investment.investor_company
    res.locals.investmentProjectStages = investmentProjectStages.map((stage) => stage.name)

    const incompleteFields = buildIncompleteFormList(get(investment, 'incomplete_fields', []))
    const isCurrentStageComplete = investment.team_complete &&
      investment.requirements_complete &&
      investment.value_complete &&
      !incompleteFields.length

    const { projects } = res.locals.paths

    res.locals.investmentStatus = {
      id: investment.id,
      meta: [
        {
          label: 'Status',
          value: upperFirst(investment.status),
          url: `${projects}/${investment.id}/status`,
          urlLabel: 'change',
        },
        {
          label: 'Project code',
          value: investment.project_code,
        },
        {
          label: 'Valuation',
          value: investment.value_complete ? 'Project valued' : 'Not yet valued',
        },
        {
          label: 'Created on',
          value: format(investment.created_on, mediumDateTimeFormat),
        },
      ],
      company: {
        name: investment.investor_company.name,
        url: `/companies/${get(investment, 'investor_company.id')}`,
      },
      currentStage: {
        incompleteFields,
        name: stageName,
        isComplete: isCurrentStageComplete,
        messages: get(toCompleteStageMessages, camelCase(stageName), []),
      },
      nextStage: getNextStage(stageName, investmentProjectStages),
    }

    res.breadcrumb(investment.name, `${projects}/${investment.id}`)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyDetails,
  getInvestmentDetails,
}
