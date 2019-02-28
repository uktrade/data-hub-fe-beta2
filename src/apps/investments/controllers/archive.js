const { get } = require('lodash')

const investmentRepository = require('../repos')

async function archiveInvestmentProjectHandler (req, res, next) {
  try {
    // Archive the project.
    const reason = (req.body.archived_reason === 'Other') ? req.body.archived_reason_other : req.body.archived_reason
    await investmentRepository.archiveInvestmentProject(req.session.token, req.params.investmentId, reason)

    res.locals.investment = Object.assign({}, res.locals.investment, {
      archived: true,
      archived_reason: reason,
      archived_by: req.session.user,
      archived_on: new Date(),
    })
    next()
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = get(res, 'locals.form', {})
      res.locals.form.errors = err.error
      res.locals.form.state = req.body
      next()
    } else {
      next(err)
    }
  }
}

async function unarchiveInvestmentProjectHandler (req, res, next) {
  try {
    await investmentRepository.unarchiveInvestmentProject(req.session.token, req.params.investmentId)
    req.flash('success', 'Investment project updated')
    res.redirect('details')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  archiveInvestmentProjectHandler,
  unarchiveInvestmentProjectHandler,
}
