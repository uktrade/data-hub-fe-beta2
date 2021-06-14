const { get, upperFirst, camelCase } = require('lodash')
const { format, parseISO } = require('date-fns')

const metadata = require('../../../lib/metadata')
const {
  buildIncompleteFormList,
  toCompleteStageMessages,
} = require('../helpers')
const { isValidGuid } = require('../../../lib/controller-utils')
const { getDitCompany } = require('../../companies/repos')
const { getAdviser } = require('../../adviser/repos')
const { getInvestment } = require('../repos')
const { DATE_TIME_MEDIUM_FORMAT } = require('../../../common/constants')
const { companies, investments } = require('../../../lib/urls')

function getNextStage(currentStage, projectStages) {
  const projectStageIndex = projectStages.findIndex((projectStage) => {
    return projectStage.name.toLowerCase() === currentStage.toLowerCase()
  })
  return projectStages[projectStageIndex + 1]
}

function getCompanyDetails(req, res, next) {
  getDitCompany(req, req.params.companyId)
    .then((company) => {
      res.locals.company = company
      return next()
    })
    .catch(next)
}

function getInvestmentProjectStages(features) {
  if (features && features['streamlined-investment-flow']) {
    return metadata.investmentProjectStage.filter(
      (stage) => stage.exclude_from_investment_flow !== true
    )
  }
  return metadata.investmentProjectStage
}

async function getInvestmentDetails(req, res, next) {
  const investmentId = req.params.investmentId

  if (!isValidGuid(investmentId)) {
    return next()
  }
  try {
    const investment = await getInvestment(req, investmentId)
    const investorCompany = await getDitCompany(
      req,
      get(investment, 'investor_company.id')
    )
    const ukCompanyId = get(investment, 'uk_company.id')
    const clientRelationshipManagerId = get(
      investment,
      'client_relationship_manager.id'
    )
    const stageName = investment.stage.name
    const investmentProjectStages = getInvestmentProjectStages(
      res.locals.features
    )

    investment.investor_company = Object.assign(
      {},
      investment.investor_company,
      investorCompany
    )

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req, ukCompanyId)
      investment.uk_company = Object.assign(
        {},
        investment.uk_company,
        companyDetails
      )
    }

    if (clientRelationshipManagerId) {
      const clientRelationshipManager = await getAdviser(
        req,
        clientRelationshipManagerId
      )
      investment.client_relationship_manager = clientRelationshipManager
    }

    res.locals.investment = investment
    res.locals.equityCompany = investment.investor_company
    res.locals.investmentProjectStages = investmentProjectStages.map(
      (stage) => stage.name
    )

    const incompleteFields = buildIncompleteFormList(
      get(investment, 'incomplete_fields', [])
    )
    const isCurrentStageComplete =
      investment.team_complete &&
      investment.requirements_complete &&
      investment.value_complete &&
      !incompleteFields.length

    res.locals.investmentStatus = {
      id: investment.id,
      meta: [
        {
          label: 'Status',
          value: upperFirst(investment.status),
          url: investments.projects.status(investment.id),
          urlLabel: 'change',
        },
        {
          label: 'Project code',
          value: investment.project_code,
        },
        {
          label: 'Valuation',
          value: investment.value_complete
            ? 'Project valued'
            : 'Not yet valued',
        },
        {
          label: 'Created on',
          value: investment.created_on
            ? format(
                new Date(parseISO(investment.created_on)),
                DATE_TIME_MEDIUM_FORMAT
              )
            : null,
        },
      ],
      company: {
        name: investment.investor_company.name,
        url: companies.detail(investment.investor_company.id),
      },
      currentStage: {
        incompleteFields,
        name: stageName,
        isComplete: isCurrentStageComplete,
        messages: get(toCompleteStageMessages, camelCase(stageName), []),
      },
      nextStage: getNextStage(stageName, investmentProjectStages),
    }

    res
      .breadcrumb('Projects', investments.projects.index())
      .breadcrumb(investment.name, investments.projects.project(investment.id))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyDetails,
  getInvestmentDetails,
}
