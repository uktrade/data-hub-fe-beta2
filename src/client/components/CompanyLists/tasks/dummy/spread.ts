import { listTaskFactory, listsTaskFactory } from '.'

export default ({
  listsLength = 5,
  listsDelay = 1000,
  listLength = 5,
  listDelay = 1000,
} = {}) => ({
  'Company lists': listsTaskFactory({ delay: listsDelay, length: listsLength }),
  'Company list': listTaskFactory({ delay: listDelay, length: listLength }),
})
