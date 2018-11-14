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
    const investmentData = await getInvestment(req.session.token, investmentId)
    const investorCompany = await getDitCompany(req.session.token, get(investmentData, 'investor_company.id'))
    const ukCompanyId = get(investmentData, 'uk_company.id')
    const clientRelationshipManagerId = get(investmentData, 'client_relationship_manager.id')
    const stageName = investmentData.stage.name
    const investmentProjectStages = getInvestmentProjectStages(res.locals.features)

    investmentData.investor_company = Object.assign({}, investmentData.investor_company, investorCompany)

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req.session.token, ukCompanyId)
      investmentData.uk_company = Object.assign({}, investmentData.uk_company, companyDetails)
    }

    if (clientRelationshipManagerId) {
      const clientRelationshipManager = await getAdviser(req.session.token, clientRelationshipManagerId)
      investmentData.client_relationship_manager = clientRelationshipManager
    }

    res.locals.investmentData = investmentData
    res.locals.equityCompany = investmentData.investor_company
    res.locals.investmentProjectStages = investmentProjectStages.map((stage) => stage.name)

    const incompleteFields = buildIncompleteFormList(get(investmentData, 'incomplete_fields', []))
    const isCurrentStageComplete = investmentData.team_complete &&
      investmentData.requirements_complete &&
      investmentData.value_complete &&
      !incompleteFields.length

    res.locals.investmentStatus = {
      id: investmentData.id,
      meta: [
        {
          label: 'Status',
          value: upperFirst(investmentData.status),
          url: `/investment-projects/${investmentData.id}/status`,
          urlLabel: 'change',
        },
        {
          label: 'Project code',
          value: investmentData.project_code,
        },
        {
          label: 'Valuation',
          value: investmentData.value_complete ? 'Project valued' : 'Not yet valued',
        },
        {
          label: 'Created on',
          value: format(investmentData.created_on, mediumDateTimeFormat),
        },
      ],
      company: {
        name: investmentData.investor_company.name,
        url: `/companies/${get(investmentData, 'investor_company.id')}`,
      },
      currentStage: {
        incompleteFields,
        name: stageName,
        isComplete: isCurrentStageComplete,
        messages: get(toCompleteStageMessages, camelCase(stageName), []),
      },
      nextStage: getNextStage(stageName, investmentProjectStages),
    }

    res.breadcrumb({
      name: investmentData.name,
      url: `/investment-projects/${investmentData.id}`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompanyDetails,
  getInvestmentDetails,
}
