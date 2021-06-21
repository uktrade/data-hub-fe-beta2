import Contact from './Contact'
import Company from './Company'

export default {
  ...Company.tasks,
  ...Contact.tasks,
}
