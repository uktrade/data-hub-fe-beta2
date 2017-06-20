/* eslint camelcase: 0 */
const express = require('express')
const postcodeService = require('../services/postcode.service')
const metadataRepository = require('../repos/metadata.repo')
const router = express.Router()
let unitedKingdom

async function postcodelookup (req, res) {
  try {
    const postcode = req.params.postcode
    const addresses = await postcodeService.lookupAddress(postcode)
    if (!unitedKingdom) {
      unitedKingdom = metadataRepository.countryOptions.find(country => country.name.toLowerCase() === 'united kingdom').id
    }
    addresses.forEach((item) => { item.country = unitedKingdom })
    res.json(addresses)
  } catch (error) {
    res.json({ error })
  }
}

router.get('/api/postcodelookup/:postcode', postcodelookup)

module.exports = {
  postcodelookup,
  router,
}
