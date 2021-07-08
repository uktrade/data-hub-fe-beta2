var contact = require('../../../fixtures/v3/search/contact.json')

exports.contacts = function (req, res) {
  if (req.body.original_query === 'no results') {
    return res.json({
      count: 0,
      results: [],
    })
  }

  res.json(contact)
}
