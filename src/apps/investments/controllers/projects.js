const renderProjectsView = async (req, res, next) => {
  try {
    const { user } = req.session
    return res.breadcrumb('Projects').render('investments/views/projects', {
      props: {
        currentAdviserId: user.id,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderProjectsView,
}
