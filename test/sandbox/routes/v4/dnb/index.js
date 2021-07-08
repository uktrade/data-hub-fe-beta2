var companyCreate = require('../../../fixtures/v4/dnb/company-create.json')
var companySearch = require('../../../fixtures/v4/dnb/company-search.json')
var companyLink = require('../../../fixtures/v4/dnb/company-link.json')
var companyChangeRequest = require('../../../fixtures/v4/dnb/company-change-request.json')
var companySearchMatched = require('../../../fixtures/v4/dnb/company-search-matched.json')
var companySearchNotMatched = require('../../../fixtures/v4/dnb/company-search-not-matched.json')
var companySearchNotMatchedUS = require('../../../fixtures/v4/dnb/company-search-not-matched-us.json')
var companyInvestigation = require('../../../fixtures/v4/dnb/company-investigation.json')

exports.companyCreate = function (req, res) {
  if (req.body.duns_number === '111111111') {
    res.json(companyCreate)
  }
}

exports.companySearch = function (req, res) {
  if (req.body.search_term === 'Simulate 500 Error') {
    return res.sendStatus(500)
  }

  if (req.body.duns_number === '268435455') {
    return res.json(companySearchNotMatchedUS)
  } else if (req.body.duns_number === '111111111') {
    return res.json(companySearchNotMatched)
  } else if (req.body.duns_number === '222222222') {
    return res.json(companySearchMatched)
  }

  return res.json(companySearch)
}

exports.companyInvestigation = function (req, res) {
  res.json(companyInvestigation)
}

exports.companyLink = function (req, res) {
  res.json(companyLink)
}

exports.companyChangeRequest = function (req, res) {
  res.json(companyChangeRequest)
}
