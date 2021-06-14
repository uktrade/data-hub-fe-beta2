import faker from 'faker'

const teamFaker = () => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobDescriptor(),
})

export default teamFaker
