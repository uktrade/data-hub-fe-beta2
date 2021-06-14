/* eslint camelcase: 0 */
const { formatDistanceToNowStrict, parseISO } = require('date-fns')

const formatDate = (date) => {
  const formattedDate = formatDistanceToNowStrict(parseISO(date), {
    addSuffix: true,
  })
  if (formattedDate == '1 day ago') {
    return 'a day ago'
  } else {
    return formattedDate
  }
}

const formatHelpCentreAnnouncements = ({ data = {} }) => {
  const { articles = [] } = data
  return articles.map((item) => {
    if (item.title && item.html_url && item.created_at) {
      return {
        heading: item.title,
        link: item.html_url,
        date: formatDate(item.created_at),
      }
    }
  })
}

module.exports = {
  formatHelpCentreAnnouncements,
}
