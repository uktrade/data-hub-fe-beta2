const { get, find } = require('lodash')

const metadata = require('../../../../lib/metadata')
const { transformObjectToOption } = require('../../../transformers')

function renderCreateProjectPage (req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/project')
}

function getHandler (req, res, next) {
  if (!res.locals.equityCompany) {
    const { projects } = res.locals.paths
    return res.redirect(`${projects}/create`)
  }

  const investmentDetails = req.store.get('investment_details')

  if (investmentDetails) {
    const investmentType = find(metadata.investmentTypeOptions.map(transformObjectToOption), { value: investmentDetails.investment_type })
    const fdiType = find(metadata.fdiOptions.map(transformObjectToOption), { value: investmentDetails.fdi_type })

    res.locals.form = get(res, 'locals.form', { options: {} })
    res.locals.form.options = Object.assign({}, res.locals.form.options, {
      investmentDetails: {
        'investment_type': investmentType,
        'fdi_type': fdiType,
      },
    })
  }

  next()
}

function postHandler (req, res, next) {
  if (get(res.locals, 'form.errors')) {
    return next()
  }

  const { resultId } = res.locals
  const { projects } = res.locals.paths

  req.flash('success', 'Investment project created')
  return res.redirect(`${projects}/${resultId}/details`)
}

module.exports = {
  getHandler,
  postHandler,
  renderCreateProjectPage,
}
