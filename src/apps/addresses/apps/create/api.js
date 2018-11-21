/* eslint camelcase: 0 */
const { transformLookupAddressToObject } = require('../../services/lookup')
const { getRegion } = require('../../services/region')

const getRegionForUKPostcode = async (address_country, postcode) => {
  if (!address_country) {
    return getRegion(postcode)
  }
}

const transformToApi = async ({
  address_1,
  address_2,
  address_town,
  address_county,
  postcode,
  address_country,
  lookup_address_id,
}) => {
  const region = getRegionForUKPostcode(address_country, postcode)

  if (lookup_address_id) {
    const transformed = transformLookupAddressToObject(lookup_address_id, postcode)
    return {
      postcode,
      region,
      ...transformed,
    }
  }

  return {
    address_1,
    address_2,
    address_town,
    address_county,
    postcode,
    address_country,
    region,
  }
}

module.exports = {
  async send (data) {
    return transformToApi(data)
      .then((transformed) => {
        console.log('posting', transformed)

        return {
          id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
        }
      })
  },
}
