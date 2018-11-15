const {
  map,
  trim,
  pickBy,
  isEmpty,
  isNil,
  join,
  compact,
} = require('lodash')
const request = require('request-promise')

const config = require('../../../../config')
const logger = require('../../../../config/logger')

const transformLookupAddressToObject = (address, postcode) => {
  const addressParts = map(address.split(','), address => trim(address))
  const parsed = pickBy({
    postcode,
    county: isEmpty(addressParts[5]) || isEmpty(addressParts[6]) ? null : addressParts[6],
    city: isEmpty(addressParts[5]) ? addressParts[6] : addressParts[5],
    address1: isEmpty(addressParts[2]) ? addressParts[0] : addressParts[0] + ' - ' + addressParts[1],
    address2: isEmpty(addressParts[2]) ? addressParts[1] : addressParts[2],
  }, value => !isNil(value) && !isEmpty(value))

  return {
    ...parsed,
    id: address,
    name: transformAddressObjectToSingleLineString(parsed),
  }
}

const transformAddressObjectToSingleLineString = (address) => {
  return join(compact([
    address.address1,
    address.address2,
    address.city,
    address.county,
  ]), ', ')
}

const getAddresses = async (postcode) => {
  const apiUrl = config.postcodeLookup.baseUrl
  const apiKey = config.postcodeLookup.apiKey
  const url = apiUrl.replace('{postcode}', postcode).replace('{api-key}', apiKey)

  try {
    const response = await request.get(url)
    const addresses = JSON.parse(response).Addresses

    return map(addresses, (address) => transformLookupAddressToObject(address, postcode))
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  getAddresses,
}
