import Contact from './Contact'
import Company from './Company'
import Countries from './Countries'

export default {
  ...Company.tasks,
  ...Contact.tasks,
  ...Countries.tasks,
}
