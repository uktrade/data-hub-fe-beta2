const request = require('request-promise')

const config = require('../../../../config')
const logger = require('../../../../config/logger')

const getRegion = async (postcode) => {
  const apiUrl = config.regionLookup.baseUrl
  const url = apiUrl.replace('{postcode}', postcode)

  try {
    const response = await request.get(url)
    return JSON.parse(response).region
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  getRegion,
}
