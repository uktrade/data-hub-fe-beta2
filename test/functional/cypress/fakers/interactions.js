import faker from 'faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import teamFaker from './team'

const interactionFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Interaction),
  company: {
    trading_names: [],
    name: faker.company.companyName(),
    id: faker.datatype.uuid(),
  },
  contacts: [userFaker()],
  dit_participants: [
    {
      adviser: userFaker(),
      team: teamFaker(),
    },
  ],
  service: {
    name: faker.lorem.words(),
    id: faker.datatype.uuid(),
  },
  ...overrides,
})

const interactionsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: interactionFaker, length, overrides })

export { interactionFaker, interactionsListFaker }

export default interactionsListFaker
