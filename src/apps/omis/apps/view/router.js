const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const { setOrderBreadcrumb } = require('../../middleware')
const {
  renderWorkOrder,
  renderQuote,
  renderPaymentReceipt,
} = require('./controllers')
const {
  setCompany,
  setContact,
  setAssignees,
  setSubscribers,
  setQuoteSummary,
  setQuotePreview,
  setQuote,
  setQuoteForm,
  setInvoice,
  setPayments,
  generateQuote,
  cancelQuote,
} = require('./middleware')

const LOCAL_NAV = [
  { path: 'work-order', label: 'Work order' },
  // { path: 'payments', label: 'Payments' },
  // { path: 'deliverables', label: 'Deliverables' },
  // { path: 'history', label: 'History' },
]

router.use(setLocalNav(LOCAL_NAV))
router.use(setCompany)
router.use(setOrderBreadcrumb)
router.use(setQuoteSummary)

router.get('/', redirectToFirstNavItem)
router.get(
  '/work-order',
  setContact,
  setAssignees,
  setSubscribers,
  setPayments,
  renderWorkOrder
)
router.get('/payment-receipt', setInvoice, setPayments, renderPaymentReceipt)
router
  .route('/quote')
  .get(setContact, setQuotePreview, setQuote, setQuoteForm, renderQuote)
  .post(setContact, generateQuote)

router.post('/quote/cancel', cancelQuote)

module.exports = router
