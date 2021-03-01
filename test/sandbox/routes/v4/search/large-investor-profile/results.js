var largeCapitalProfile = require('./../../../../fixtures/v4/investment/large-capital-profile-list10.json')

exports.largeInvestorProfile = function (req, res) {
  const countryOfOriginFilter = req.body.country_of_origin || []
  const assetClassesOfInterestFilter = req.body.asset_classes_of_interest || []
  const investorCompanyNameFilter = req.body.investor_company_name
  const investorTypesFilter = req.body.investor_type || []

  const filtered = largeCapitalProfile.results
    .filter(({ country_of_origin }) =>
      countryOfOriginFilter.length
        ? countryOfOriginFilter.includes(country_of_origin)
        : true
    )
    .filter(({ asset_classes_of_interest = [] }) =>
      assetClassesOfInterestFilter.length
        ? _.intersection(
            assetClassesOfInterestFilter,
            asset_classes_of_interest.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ investor_company: { name = '' } }) =>
      investorCompanyNameFilter
        ? name
            .toLowerCase()
            .includes(req.body.investor_company_name.toLowerCase())
        : true
    )
    .filter(({ investor_type }) =>
      investorTypesFilter.length
        ? investor_type && investorTypesFilter.includes(investor_type.id)
        : true
    )

  res.json({
    count: filtered.length,
    results: filtered,
  })
}
