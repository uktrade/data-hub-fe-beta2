const faker = require('faker')

const { EXPORT_INTEREST_STATUS } = require('../../apps/constants')
const getExportCountries = require('../get-export-countries')

function generateCountries(length) {
  return Array.from({ length }).map(faker.datatype.uuid)
}

describe('getExportCountries', () => {
  context('When the countries are an array', () => {
    it('should transform the countries into an object', () => {
      const countries = generateCountries(6)

      const future = countries.slice(0, 2)
      const exporting = countries.slice(2, 4)
      const notInterested = countries.slice(4, 6)

      expect(
        getExportCountries({
          [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: future,
          [EXPORT_INTEREST_STATUS.EXPORTING_TO]: exporting,
          [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: notInterested,
        })
      ).to.deep.equal([
        {
          country: { id: countries[2] },
          status: EXPORT_INTEREST_STATUS.EXPORTING_TO,
        },
        {
          country: { id: countries[3] },
          status: EXPORT_INTEREST_STATUS.EXPORTING_TO,
        },
        {
          country: { id: countries[0] },
          status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
        },
        {
          country: { id: countries[1] },
          status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
        },
        {
          country: { id: countries[4] },
          status: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
        },
        {
          country: { id: countries[5] },
          status: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
        },
      ])
    })
  })

  context('When the countries are strings', () => {
    it('should transform the countries into an object', () => {
      const countries = generateCountries(3)

      const future = countries[0]
      const exporting = countries[1]
      const notInterested = countries[2]

      expect(
        getExportCountries({
          [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: future,
          [EXPORT_INTEREST_STATUS.EXPORTING_TO]: exporting,
          [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: notInterested,
        })
      ).to.deep.equal([
        {
          country: { id: countries[1] },
          status: EXPORT_INTEREST_STATUS.EXPORTING_TO,
        },
        {
          country: { id: countries[0] },
          status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
        },
        {
          country: { id: countries[2] },
          status: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
        },
      ])
    })
  })

  context('When there are no countries', () => {
    it('should return an empty array', () => {
      expect(getExportCountries({})).to.deep.equal(null)
    })
  })
})
