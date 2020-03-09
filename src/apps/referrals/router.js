const router = require('express').Router()
const urls = require('../../lib/urls')

const { renderSendReferralForm, renderSendReferralForm2 } = require('./apps/send-referral/controllers')
const renderReferralDetails = require('./apps/details/controller')
const renderReferralHelp = require('./apps/help/controller')
const { getCompany } = require('../companies/middleware/params')

router.param('companyId', getCompany)

router.get(urls.referrals.send.route, renderSendReferralForm)
router.get(urls.referrals.send2.route, renderSendReferralForm2)
router.get(urls.referrals.details.route, renderReferralDetails)
router.get(urls.referrals.help.route, renderReferralHelp)

module.exports = router
