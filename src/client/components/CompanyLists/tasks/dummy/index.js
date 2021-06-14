import faker from 'faker'

const randomLists = ({ length, max = 10 }) =>
  Array(length || faker.datatype.number(max))
    .fill(null)
    .reduce(
      (a) => ({ ...a, [faker.datatype.uuid()]: faker.random.words(3) }),
      {}
    )

const randomList = ({ length, max = 10, id }) =>
  Array(length || faker.datatype.number(max))
    .fill()
    .map(() => ({
      id: id || faker.datatype.uuid(),
      name: faker.random.words(3),
      interactionId: faker.datatype.uuid(),
      date: faker.date.past(),
      subject: faker.random.words(3),
      ditParticipants: Array(faker.datatype.number(2))
        .fill()
        .map(() => ({
          name: faker.name.findName(),
          team: faker.random.words(3),
        })),
    }))

export const listsTaskFactory =
  ({ delay, lists, length }) =>
  () =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, lists || randomLists(length))
    )

export const listTaskFactory =
  ({ delay, ...rest } = {}) =>
  (id) =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, randomList({ id, ...rest }))
    )
