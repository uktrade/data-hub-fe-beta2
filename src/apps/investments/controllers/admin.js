function renderAdminView(req, res) {
  const { id, name, stage } = res.locals.investment

  res.locals.title = `Admin - ${name} - Projects - Investments - DIT Data Hub`
  res.render('investments/views/admin/client-container.njk', {
    props: {
      id,
      name,
      stage,
    },
  })
}

module.exports = { renderAdminView }
