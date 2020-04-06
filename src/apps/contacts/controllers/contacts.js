function renderContacts(req, res) {
  return res.breadcrumb('Contacts').render('contacts/views/template', {})
}

module.exports = {
  renderContacts,
}
