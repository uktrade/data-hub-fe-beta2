var incompleteLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-incomplete.json')
var completeLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-complete.json')
var largeCapitalOpportunityList = require('../../../fixtures/v4/investment/large-capital-opportunity-list.json')
var largeCapitalOpportunityListOnePage = require('../../../fixtures/v4/investment/large-capital-opportunity-list-one-page.json')
var ukRegions = require('../../../fixtures/metadata/uk-region.json')
var requiredChecksConducted = require('../../../fixtures/metadata/capital-investment-required-checks.json')
var classesOfInterest = require('../../../fixtures/metadata/capital-investment-asset-class-interest.json')
var constructionRisks = require('../../../fixtures/metadata/capital-investment-construction-risks.json')
var advisers = require('../../../fixtures/adviser-list.json')
var promoters = require('../../../fixtures/v4/company/companies.json')

exports.getLargeCapitalOpportunity = function (req, res) {
  if (req.params.opportunityId == completeLargeCapitalOpportunity.id) {
    res.json(completeLargeCapitalOpportunity)
  } else {
    res.json(incompleteLargeCapitalOpportunity)
  }
}

exports.getLargeCapitalOpportunityList = function (req, res) {
  if (req.body.sortby == 'name:asc') {
    return res.json(largeCapitalOpportunityListOnePage)
  }
  res.json(largeCapitalOpportunityList)
}

exports.saveOpportunityDetails = function (req, res) {
  res.json(completeLargeCapitalOpportunity)
}

const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

exports.getDetailsMetadata = function (res) {
  return res.json({
    ukRegions: ukRegions.map(idNameToValueLabel),
    requiredChecksConducted: requiredChecksConducted.map(idNameToValueLabel),
    classesOfInterest: classesOfInterest.map(idNameToValueLabel),
    constructionRisks: constructionRisks.map(idNameToValueLabel),
    promoters: promoters.map(idNameToValueLabel),
    advisers: advisers.map(idNameToValueLabel),
  })
}
