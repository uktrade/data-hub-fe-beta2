const { getInteractionsForInvestment } = require('../../interactions/repos')
const {
  transformInteractionToListItem,
  transformInteractionListItemToHaveUrlPrefix,
} = require('../../interactions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderInteractionList (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.investmentId

    const interactions = await getInteractionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem,
        transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink)
      ))

    return res
      .breadcrumb('Interactions')
      .render('investment-projects/views/interactions', {
        interactions,
        actionButtons: [{
          label: 'Add interaction',
          url: `/investment-projects/${investmentId}/interactions/create/interaction`,
        }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
