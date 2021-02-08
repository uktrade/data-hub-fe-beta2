const propositions = require('../../../fixtures/v4/proposition/propositions')

exports.propositions = function (req, res) {
  res.json(propositions)
}
