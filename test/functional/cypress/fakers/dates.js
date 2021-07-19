import { addDays } from '../../../../src/client/utils/date-utils'
import faker from 'faker'

const relativeDateFaker = ({ minDays, maxDays }) =>
  faker.date.between(addDays(new Date(), minDays), addDays(new Date(), maxDays))

export { relativeDateFaker }
