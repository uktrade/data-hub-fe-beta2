/* eslint camelcase: 0 */
const moment = require('moment')
const { camelCase } = require('lodash')

const formatHelpCentreAnnouncements = (feed = {}) => {
  const { articles = [] } = feed
  return articles.map((item) => {
    if (item.title && item.html_url && item.created_at) {
      return {
        heading: item.title,
        link: item.html_url,
        date: moment(item.created_at).fromNow(),
      }
    }
  })
}

/**
 * Summarise a list of projects into totals at each stage
 */
const summariseProjectStages = ({
  investmentProjects = [],
  initialTotals = {
    prospect: 0,
    assigned: 0,
    active: 0,
    verifyWin: 0,
    won: 0,
  },
}) => {
  return investmentProjects.reduce((totals, currentValue) => {
    const stage = camelCase(currentValue.stage.name)
    totals[stage] = (totals[stage] || 0) + 1
    return totals
  }, initialTotals)
}

module.exports = {
  formatHelpCentreAnnouncements,
  summariseProjectStages,
}
