var largeCapitalOpportunityList = require('../../../fixtures/v4/investment/large-capital-opportunity-list.json')

exports.getLargeCapitalOpportunity = function (req, res) {
  res.json(largeCapitalOpportunityList.results[0])
}
