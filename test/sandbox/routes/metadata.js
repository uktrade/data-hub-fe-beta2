var likelihoodToLand = require('../fixtures/metadata/likelihood-to-land.json')
var investmentInvestorType = require('../fixtures/metadata/likelihood-to-land.json')
var investmentInvolvement = require('../fixtures/metadata/investment-involvement.json')
var investmentSpecificProgramme = require('../fixtures/metadata/investment-specific-programme.json')
var investmentProjectStage = require('../fixtures/metadata/investment-project-stage.json')
var investmentBusinessActivity = require('../fixtures/metadata/investment-business-activity.json')
var investmentType = require('../fixtures/metadata/investment-type.json')
var investmentStrategicDriver = require('../fixtures/metadata/investment-strategic-driver.json')
var exportExperienceCategory = require('../fixtures/metadata/export-experience-category.json')
var orderServiceType = require('../fixtures/metadata/order-service-type.json')
var orderCancellationReason = require('../fixtures/metadata/order-cancellation-reason.json')
var omisMarket = require('../fixtures/metadata/omis-market.json')
var fdiValue = require('../fixtures/metadata/fdi-value.json')
var fdiType = require('../fixtures/metadata/fdi-type.json')
var salaryRange = require('../fixtures/metadata/salary-range.json')
var turnover = require('../fixtures/metadata/turnover.json')
var sector = require('../fixtures/metadata/sector.json')
var sectorLte0 = require('../fixtures/metadata/sector-lte0.json')
var locationType = require('../fixtures/metadata/location-type.json')
var eventType = require('../fixtures/metadata/event-type.json')
var programme = require('../fixtures/metadata/programme.json')
var businessType = require('../fixtures/metadata/business-type.json')
var evidenceTag = require('../fixtures/metadata/evidence-tag.json')
var employeeRange = require('../fixtures/metadata/employee-range.json')
var country = require('../fixtures/metadata/country.json')
var ukRegion = require('../fixtures/metadata/uk-region.json')
var administrativeArea = require('../fixtures/metadata/administrative-area.json')
var referralSourceWebsite = require('../fixtures/metadata/referral-source-website.json')
var referralSourceMarketing = require('../fixtures/metadata/referral-source-marketing.json')
var referralSourceActivity = require('../fixtures/metadata/referral-source-activity.json')
var headquarterType = require('../fixtures/metadata/headquarter-type.json')
var service = require('../fixtures/metadata/service.json')
var communicationChannel = require('../fixtures/metadata/communication-channel.json')
var team = require('../fixtures/metadata/team.json')
var policyArea = require('../fixtures/metadata/policy-area.json')
var policyIssueType = require('../fixtures/metadata/policy-issue-type.json')
var serviceDeliveryStatus = require('../fixtures/metadata/service-delivery-status.json')
var capitalInvestmentInvestorType = require('../fixtures/metadata/capital-investment-investor-type.json')
var capitalInvestmentRequiredChecks = require('../fixtures/metadata/capital-investment-required-checks.json')
var capitalInvestmentDealTicketSize = require('../fixtures/metadata/capital-investment-deal-ticket-size.json')
var capitalInvestmentInvestmentTypes = require('../fixtures/metadata/capital-investment-investment-types.json')
var capitalInvestmentMinimumReturnRate = require('../fixtures/metadata/capital-investment-return-rate.json')
var capitalInvestmentTimeHorizons = require('../fixtures/metadata/capital-investment-time-horizons.json')
var capitalInvestmentRestrictions = require('../fixtures/metadata/capital-investment-restrictions.json')
var capitalInvestmentConstructionRisks = require('../fixtures/metadata/capital-investment-construction-risks.json')
var capitalInvestmentEquityPercentage = require('../fixtures/metadata/capital-investment-equity-percentage.json')
var capitalInvestmentDesiredDealRoles = require('../fixtures/metadata/capital-investment-desired-deal-roles.json')
var capitalInvestmentAssetClassInterest = require('../fixtures/metadata/capital-investment-asset-class-interest.json')
var oneListTier = require('../fixtures/metadata/one-list-tier.json')

exports.likelihoodToLand = function (req, res) {
  res.json(likelihoodToLand)
}

exports.investmentInvestorType = function (req, res) {
  res.json(investmentInvestorType)
}

exports.investmentSpecificProgramme = function (req, res) {
  res.json(investmentSpecificProgramme)
}

exports.investmentInvolvement = function (req, res) {
  res.json(investmentInvolvement)
}

exports.investmentProjectStage = function (req, res) {
  res.json(investmentProjectStage)
}

exports.investmentBusinessActivity = function (req, res) {
  res.json(investmentBusinessActivity)
}

exports.investmentType = function (req, res) {
  res.json(investmentType)
}

exports.investmentStrategicDriver = function (req, res) {
  res.json(investmentStrategicDriver)
}

exports.exportExperienceCategory = function (req, res) {
  res.json(exportExperienceCategory)
}

exports.orderServiceType = function (req, res) {
  res.json(orderServiceType)
}

exports.orderCancellationReason = function (req, res) {
  res.json(orderCancellationReason)
}

exports.omisMarket = function (req, res) {
  res.json(omisMarket)
}

exports.fdiValue = function (req, res) {
  res.json(fdiValue)
}

exports.fdiType = function (req, res) {
  res.json(fdiType)
}

exports.salaryRange = function (req, res) {
  res.json(salaryRange)
}

exports.turnover = function (req, res) {
  res.json(turnover)
}

exports.sector = function (req, res) {
  if (req.query.level__lte === '0') {
    return res.json(sectorLte0)
  }
  res.json(sector)
}

exports.locationType = function (req, res) {
  res.json(locationType)
}

exports.eventType = function (req, res) {
  res.json(eventType)
}

exports.programme = function (req, res) {
  res.json(programme)
}

exports.businessType = function (req, res) {
  res.json(businessType)
}

exports.evidenceTag = function (req, res) {
  res.json(evidenceTag)
}

exports.employeeRange = function (req, res) {
  res.json(employeeRange)
}

exports.country = function (req, res) {
  res.json(country)
}

exports.ukRegion = function (req, res) {
  res.json(ukRegion)
}

exports.administrativeArea = function (req, res) {
  res.json(administrativeArea)
}

exports.referralSourceWebsite = function (req, res) {
  res.json(referralSourceWebsite)
}

exports.referralSourceMarketing = function (req, res) {
  res.json(referralSourceMarketing)
}

exports.referralSourceActivity = function (req, res) {
  res.json(referralSourceActivity)
}

exports.headquarterType = function (req, res) {
  res.json(headquarterType)
}

exports.service = function (req, res) {
  res.json(service)
}

exports.communicationChannel = function (req, res) {
  res.json(communicationChannel)
}

exports.team = function (req, res) {
  res.json(team)
}

exports.policyArea = function (req, res) {
  res.json(policyArea)
}

exports.policyIssueType = function (req, res) {
  res.json(policyIssueType)
}

exports.serviceDeliveryStatus = function (req, res) {
  res.json(serviceDeliveryStatus)
}

exports.capitalInvestmentInvestorType = function (req, res) {
  res.json(capitalInvestmentInvestorType)
}

exports.capitalInvestmentRequiredChecks = function (req, res) {
  res.json(capitalInvestmentRequiredChecks)
}

exports.capitalInvestmentDealTicketSize = function (req, res) {
  res.json(capitalInvestmentDealTicketSize)
}

exports.capitalInvestmentInvestmentTypes = function (req, res) {
  res.json(capitalInvestmentInvestmentTypes)
}

exports.capitalInvestmentMinimumReturnRate = function (req, res) {
  res.json(capitalInvestmentMinimumReturnRate)
}

exports.capitalInvestmentTimeHorizons = function (req, res) {
  res.json(capitalInvestmentTimeHorizons)
}

exports.capitalInvestmentRestrictions = function (req, res) {
  res.json(capitalInvestmentRestrictions)
}

exports.capitalInvestmentConstructionRisks = function (req, res) {
  res.json(capitalInvestmentConstructionRisks)
}

exports.capitalInvestmentEquityPercentage = function (req, res) {
  res.json(capitalInvestmentEquityPercentage)
}

exports.capitalInvestmentDesiredDealRoles = function (req, res) {
  res.json(capitalInvestmentDesiredDealRoles)
}

exports.capitalInvestmentAssetClassInterest = function (req, res) {
  res.json(capitalInvestmentAssetClassInterest)
}

exports.oneListTier = function (req, res) {
  res.json(oneListTier)
}
