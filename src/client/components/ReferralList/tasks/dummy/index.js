import faker from 'faker'

const randomAdviser = () => ({
  ...faker.helpers.createCard(),
  team: faker.random.words(3),
})

const randomReferral = () => ({
  companyId: faker.datatype.uuid(),
  id: faker.datatype.uuid(),
  subject: faker.lorem.sentence(),
  companyName: faker.company.companyName(),
  date: faker.date.past(1),
  dateAccepted: faker.date.recent(),
  sender: randomAdviser(),
  recipient: randomAdviser(),
  direction: Math.random() > 0.5 ? 'sent' : 'received',
})

const randomReferrals = (length) => Array(length).fill(null).map(randomReferral)

export default (delay = 1000, length = 10) =>
  () =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, randomReferrals(length))
    )
