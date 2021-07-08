import faker from 'faker'
import { listFaker } from './utils'

const companyOneListgroupTierFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobArea(),
  disabled_on: null,
  ...overrides,
})

const companyOneListgroupTierListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyOneListgroupTierFaker, length, overrides })

export { companyOneListgroupTierFaker, companyOneListgroupTierListFaker }

export default companyOneListgroupTierListFaker
