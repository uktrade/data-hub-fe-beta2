const { getDITRegionFromUKPostcode } = require('../services')
const { getOptions } = require('../../../lib/options')

async function postcodeToRegionLookupHandler(req, res) {
  const { token } = req.session
  const { postcode } = req.params

  try {
    const { results } = await getDITRegionFromUKPostcode(postcode)
    if (results.length === 0) {
      // Unknown postcode.
      res.json({})
      return
    }

    const regionName = results[0].regionName
    const regions = await getOptions(token, 'uk-region')
    const region = regions.find((region) => region.label === regionName)
    res.json(region)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

module.exports = {
  postcodeToRegionLookupHandler,
}
