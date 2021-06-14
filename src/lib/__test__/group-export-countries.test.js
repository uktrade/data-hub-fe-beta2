const { uuid } = require('faker').datatype
const { EXPORT_INTEREST_STATUS } = require('../../apps/constants')

const {
  generateExportCountries,
  generateCountries,
  createExportCountry,
} = require('../../../test/unit/helpers/generate-export-countries')

const { FUTURE_INTEREST, EXPORTING_TO, NOT_INTERESTED } = EXPORT_INTEREST_STATUS

function createExpected(countries) {
  return countries.sort((a, b) => a.name.localeCompare(b.name))
}

function createCountry(name, status) {
  return {
    country: {
      id: uuid(),
      name,
    },
    status,
  }
}

const groupExportCountries = require('../group-export-countries')

describe('groupExportCountries', () => {
  context('With no countries', () => {
    it('Should return an empty object', () => {
      expect(groupExportCountries()).to.deep.equal({})
    })
  })

  context('With countries for each status', () => {
    context('With randomly generated countries', () => {
      it('Should separate out the countries and order them alphabetially', () => {
        const { future, current, noInterest, exportCountries } =
          generateExportCountries()

        const buckets = groupExportCountries(exportCountries)

        expect(buckets[FUTURE_INTEREST]).to.deep.equal(createExpected(future))
        expect(buckets[EXPORTING_TO]).to.deep.equal(createExpected(current))
        expect(buckets[NOT_INTERESTED]).to.deep.equal(
          createExpected(noInterest)
        )
      })
    })

    context('With static countries', () => {
      it('Should separate out the countries and order them alphabetically', () => {
        const countries = [
          createCountry('France', FUTURE_INTEREST),
          createCountry('Spain', FUTURE_INTEREST),
          createCountry('Germany', FUTURE_INTEREST),
        ]

        const buckets = groupExportCountries(countries)

        expect(buckets[FUTURE_INTEREST]).to.deep.equal([
          countries[0].country,
          countries[2].country,
          countries[1].country,
        ])
      })
    })
  })

  context('With unexpected statuses', () => {
    it('Should only return the known statuses and order them alphabetically', () => {
      const FAKE_STATUS = 'fake-status'
      const { future, current, noInterest, exportCountries } =
        generateExportCountries()

      exportCountries.push(
        ...generateCountries(2).map(createExportCountry(FAKE_STATUS))
      )

      const buckets = groupExportCountries(exportCountries)

      expect(buckets[FUTURE_INTEREST]).to.deep.equal(createExpected(future))
      expect(buckets[EXPORTING_TO]).to.deep.equal(createExpected(current))
      expect(buckets[NOT_INTERESTED]).to.deep.equal(createExpected(noInterest))
      expect(buckets[FAKE_STATUS]).to.be.undefined
    })
  })
})
