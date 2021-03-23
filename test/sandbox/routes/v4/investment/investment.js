var largeCapitalOpportunityList = require('../../../fixtures/v4/investment/large-capital-opportunity-list.json')

exports.getLargeCapitalOpportunity = function (req, res) {
  // var opportunityId = req.params.opportunityId

  // TODO: add some examples to look up
  res.json(largeCapitalOpportunityList.results[1])
}
