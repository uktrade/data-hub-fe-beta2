const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

const DHP = 'DHP'
const DOCUMENTS = 'documents'

const isProjectNew = (investment) => investment.project_code.startsWith(DHP)

const filterDocNavItemIfProjectIsNew = (investment) => {
  const isNew = isProjectNew(investment)
  return LOCAL_NAV.filter(({ path }) => !(path === DOCUMENTS && isNew))
}

const setLocalNavigation = (req, res, next) => {
  const { investment, user } = res.locals
  const userIsAdmin = user.hasPermission(
    'investment.change_to_any_stage_investmentproject'
  )
  const checkShowAdminTab = (navItems) =>
    userIsAdmin ? navItems : navItems.filter((item) => item.path !== 'admin')

  const navItems = checkShowAdminTab(
    investment ? filterDocNavItemIfProjectIsNew(investment) : LOCAL_NAV
  )

  setLocalNav(navItems)(req, res, next)
}

module.exports = setLocalNavigation
