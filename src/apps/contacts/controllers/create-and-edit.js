module.exports = (req, res) =>
  res.render('contacts/views/create-and-edit', {
    props: {
      contactId: req.params.contactId,
      companyId: req.query.company,
    },
  })
