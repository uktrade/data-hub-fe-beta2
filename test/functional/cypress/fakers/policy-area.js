import faker from 'faker'
import { listFaker } from './utils'

const policyAreaFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobArea(),
  disabled_on: null,
  ...overrides,
})

const policyAreaListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: policyAreaFaker, length, overrides })

export { policyAreaFaker, policyAreaListFaker }

export default policyAreaListFaker
