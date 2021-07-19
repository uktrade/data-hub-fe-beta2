const renderOpportunitiesView = (req, res, next) => {
  try {
    res
      .breadcrumb('UK Opportunities')
      .render('investments/views/opportunities', {
        heading: 'UK Opportunities',
        props: {
          opportunityId: req.params.opportunityId,
        },
      })
  } catch (error) {
    next(error)
  }
}

const renderOpportunityDetailsView = (req, res, next) => {
  try {
    res.render('investments/views/opportunity-details', {
      props: {
        opportunityId: req.params.opportunityId,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderOpportunitiesView, renderOpportunityDetailsView }
