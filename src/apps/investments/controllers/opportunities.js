const renderOpportunitiesView = (req, res, next) => {
  try {
    res
      .breadcrumb('UK Opportunities')
      .render('investments/views/opportunities', {
        heading: 'UK Opportunities',
      })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderOpportunitiesView }
