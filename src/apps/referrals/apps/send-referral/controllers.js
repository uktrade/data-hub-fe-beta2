const urls = require('../../../../lib/urls')
const { authorisedRequest } = require('../../../../lib/authorised-request')
const { omit } = require('lodash')
const config = require('../../../../config/index')

function renderSendReferralForm(req, res) {
  const {
    company: { contacts, name, id },
  } = res.locals
  const companyContacts = contacts.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    id: id,
  }))
  res
    .breadcrumb(name, `/companies/${id}`)
    .breadcrumb('Send a referral')
    .render('referrals/apps/send-referral/views/client-container', {
      heading: 'Send a referral',
      props: {
        companyContacts,
        companyName: name,
        companyId: id,
        cancelUrl: urls.companies.detail(id),
      },
    })
}

function renderSendReferralForm2(req, res) {
  const {
    company: { contacts, name, id },
  } = res.locals
  const companyContacts = contacts.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    id: id,
  }))
  res
    .breadcrumb(name, `/companies/${id}`)
    .breadcrumb('Send a referral')
    .render('referrals/apps/send-referral/views/client-container2', {
      heading: 'Send a referral',
      props: {
        companyContacts,
        companyName: name,
        companyId: id,
        cancelUrl: urls.companies.detail(id),
      },
    })
}

async function submitSendReferralForm(req, res, next) {
  try {
    await authorisedRequest(req.session.token, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company-referral`,
      body: omit(req.body, '_csrf'),
    })
    req.flashWithBody(
      'success',
      'Referral sent',
      `You can <a href="${urls.dashboard()}">find your referrals on the Homepage</a>.`
    )
    res.redirect(urls.companies.detail(res.locals.company.id))
  } catch (error) {
    next(error)
  }
}

module.exports = { renderSendReferralForm, submitSendReferralForm, renderSendReferralForm2 }
