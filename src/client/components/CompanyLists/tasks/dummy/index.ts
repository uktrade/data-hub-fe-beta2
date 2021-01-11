import faker from 'faker'

import {CompanyListsTask, CompanyListTask, CompanyListItem} from '../../types'

interface RandomListsParams {
  length?: number
  max?: number
}

const randomLists = ({ length, max = 10 }: RandomListsParams) =>
  Array(length || faker.random.number(max))
    .fill(null)
    .reduce((a) => ({ ...a, [faker.random.uuid()]: faker.random.words(3) }), {})

interface RandomListParams extends RandomListsParams {
  id?: string
}

const randomList = ({ length, max = 10, id }: RandomListParams) =>
  Array(length || faker.random.number(max))
    .fill(null)
    .map(() => ({
      id: id || faker.random.uuid(),
      name: faker.random.words(3),
      interactionId: faker.random.uuid(),
      date: faker.date.past(),
      subject: faker.random.words(3),
      ditParticipants: Array(faker.random.number(2))
        .fill(null)
        .map(() => ({
          name: faker.name.findName(),
          team: faker.random.words(3),
        })),
    }))

    
interface FactoryParams extends RandomListParams {
  delay: number
} 

interface ListsTaskFactoryParams extends FactoryParams {
  lists?: CompanyListItem[] 
}

type ListTasksFactory = (params: ListsTaskFactoryParams) => CompanyListsTask
export const listsTaskFactory: ListTasksFactory = ({ delay, lists, length }) =>
  () =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, lists || randomLists({length}))
    )

type ListTaskFactory = (params: FactoryParams) => CompanyListTask
export const listTaskFactory: ListTaskFactory = ({ delay = 1000, ...rest }) =>
  (id) =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, randomList({ id, ...rest }))
    )
