const { searchDnbCompanies } = require('../../../../modules/search/services')

async function renderAddCompanyForm (req, res, next) {
  try {
    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container', {
        props: {
          csrfToken: res.locals.csrfToken,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function blah (req, res, next) {
  try {
    const requestBody = {
      search_term: 'ralph',
      address_country: 'GB',
      page_size: 100,
    }
    const results = await searchDnbCompanies({
      token: req.session.token,
      requestBody: requestBody,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddCompanyForm,
  blah,
}
