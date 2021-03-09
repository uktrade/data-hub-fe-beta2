const router = require('express').Router()
const paths = require('./paths')

const projectsRouter = require('./router-projects')
const profilesRouter = require('./router-profiles')
const opportunitiesRouter = require('./router-opportunities')

router.use((req, res, next) => {
  res.locals.paths = paths
  next()
})

router.use('/projects', projectsRouter)
router.use('/profiles', profilesRouter)
router.use('/opportunities', opportunitiesRouter)

const redirectToProjects = (res) => {
  const { projects } = res.locals.paths
  res.redirect(projects)
}

router.get('/', (req, res) => {
  redirectToProjects(res)
})

module.exports = router
