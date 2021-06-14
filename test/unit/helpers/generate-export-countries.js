const faker = require('faker')

const { EXPORT_INTEREST_STATUS } = require('../../../src/apps/constants')

function generateCountries(length) {
  return Array.from({ length }).map(() => ({
    id: faker.datatype.uuid(),
    name: faker.address.country(),
  }))
}

function createExportCountry(status) {
  return ({ id, name }) => ({ country: { id, name }, status })
}

function generateExportCountries() {
  const future = generateCountries(2)
  const current = generateCountries(2)
  const noInterest = generateCountries(2)

  return {
    future,
    current,
    noInterest,
    exportCountries: [
      ...future.map(
        createExportCountry(EXPORT_INTEREST_STATUS.FUTURE_INTEREST)
      ),
      ...current.map(createExportCountry(EXPORT_INTEREST_STATUS.EXPORTING_TO)),
      ...noInterest.map(
        createExportCountry(EXPORT_INTEREST_STATUS.NOT_INTERESTED)
      ),
    ],
  }
}

module.exports = {
  generateCountries,
  createExportCountry,
  generateExportCountries,
}
