import faker from 'faker'
import { listFaker } from './utils'

const policyIssueTypeFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobArea(),
  disabled_on: null,
  ...overrides,
})

const policyIssueTypeListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: policyIssueTypeFaker, length, overrides })

export { policyIssueTypeFaker, policyIssueTypeListFaker }

export default policyIssueTypeListFaker
