const { isEmpty } = require('lodash')

function createGetInteractionHandler (req, res, next) {
  return res
    .breadcrumb.add('Add interaction')
    .render('investment-projects/views/interactions/create')
}

function createPostInteractionHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }

  req.flash('success', 'Investment Interaction successfully created')
  return res.redirect(`/investment-projects/${res.locals.investmentData.id}/interactions`)
}

module.exports = {
  createGetInteractionHandler,
  createPostInteractionHandler,
}
