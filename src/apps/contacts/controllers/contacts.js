function renderContacts(req, res) {
  const { contactId } = req.params
  return res.breadcrumb('Contacts').render('contacts/views/template', {
    props: {
      contactId,
    },
  })
}

module.exports = {
  renderContacts,
}
