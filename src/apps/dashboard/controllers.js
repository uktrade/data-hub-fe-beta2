const { get } = require('lodash')
const rp = require('request-promise')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const config = require('../../config')
const {
  formatHelpCentreAnnouncements,
  summariseProjectStages,
} = require('./transformers')
const { searchInvestments } = require('../../modules/search/services')

function getCurrentFinancialYearStart() {
  const today = new Date()
  if (today.getMonth() + 1 <= 3) {
    return today.getFullYear() - 1
  } else {
    return today.getFullYear()
  }
}

async function getInvestmentProjectsSummary(req, filters) {
  try {
    // Note that this does not deal with paginated results so it's just
    // asking for a lot of projects in one go. Iterating over more than any
    // more than a hundred results is going to be quite inefficient and take
    // quite a while, so ideally we need a new endpoint for the summaries.
    // TODO: deal with pagination
    const response = await searchInvestments({
      req,
      searchTerm: '',
      page: 1,
      limit: 10000,
      filters,
    })
    return summariseProjectStages({
      investmentProjects: response.results,
    })
  } catch (e) {
    // Fail silently
  }
}

async function renderDashboard(req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')
    const { user } = req.session
    const currentAdviserId = user.id
    const helpCentre = config.helpCentre
    let articleFeed

    try {
      const helpCentreArticleFeed = await rp({
        uri: config.helpCentre.apiFeed,
        auth: {
          bearer: config.helpCentre.token,
        },
        qs: { test: req.query.test },
        json: true,
        timeout: 1000,
      })
      articleFeed = formatHelpCentreAnnouncements(helpCentreArticleFeed) || []
    } catch (e) {
      // If we encounter an error when fetching the latest help centre articles,
      // just show an empty feed
      articleFeed = []
    }

    const financialYear = getCurrentFinancialYearStart()

    let investmentProjectsSummary = {
      currentYear: null,
      previousYear: null,
    }
    // TODO: check whether date bounds are inclusive (ie do I have to specify 03-31)
    // TODO: prospects should return all prospects regardless of dates
    investmentProjectsSummary.currentYear = await getInvestmentProjectsSummary(
      req,
      {
        adviser: currentAdviserId,
        estimated_land_date_after: new Date(`${financialYear}-04-01`).toJSON(),
        estimated_land_date_before: new Date(
          `${financialYear + 1}-04-01`
        ).toJSON(),
      }
    )
    investmentProjectsSummary.previousYear = await getInvestmentProjectsSummary(
      req,
      {
        adviser: currentAdviserId,
        estimated_land_date_after: new Date(
          `${financialYear - 1}-04-01`
        ).toJSON(),
        estimated_land_date_before: new Date(`${financialYear}-04-01`).toJSON(),
      }
    )

    res.title('Dashboard').render('dashboard/views/dashboard', {
      articleFeed,
      investmentProjectsSummary,
      interactionsPermitted: isPermittedRoute(
        '/interactions',
        GLOBAL_NAV_ITEMS,
        userPermissions
      ),
      helpCentre,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDashboard,
}
