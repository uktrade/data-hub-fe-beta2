import faker from 'faker'
import { listFaker } from './utils'

const teamFaker = () => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobDescriptor(),
})

const teamListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: teamFaker, length, overrides })

export { teamFaker, teamListFaker }

export default teamListFaker
