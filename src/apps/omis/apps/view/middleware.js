const { assign, get, filter, mapValues, pickBy } = require('lodash')
const path = require('path')
const i18nFuture = require('i18n-future')

const logger = require('../../../../../config/logger')
const { Order } = require('../../models')
const { setCompany: setCompanyMW } = require('../../middleware')
const { getContact } = require('../../../contacts/repos')
const { transformPaymentToView } = require('../../transformers')
const editSteps = require('../edit/steps')

const i18n = i18nFuture({
  path: path.resolve(__dirname, '../../locales/__lng__/__ns__.json'),
})

function setTranslation (req, res, next) {
  res.locals.translate = (key) => {
    return i18n.translate(key)
  }
  next()
}

function setCompany (req, res, next) {
  const orderId = get(res.locals, 'order.company.id')

  if (!orderId) {
    return next()
  }

  setCompanyMW(req, res, next, orderId)
}

async function setContact (req, res, next) {
  const contactId = get(res.locals, 'order.contact.id')

  if (!contactId) {
    return next()
  }

  try {
    const contact = await getContact(req.session.token, contactId)

    res.locals.order.contact = contact
    next()
  } catch (error) {
    next(error)
  }
}

async function setAssignees (req, res, next) {
  const orderId = get(res.locals, 'order.id')

  if (orderId) {
    try {
      const assignees = await Order.getAssignees(req.session.token, orderId)

      res.locals.assignees = assignees
    } catch (error) {
      return next(error)
    }
  }
  next()
}

async function setSubscribers (req, res, next) {
  const orderId = get(res.locals, 'order.id')

  if (orderId) {
    try {
      const subscribers = await Order.getSubscribers(req.session.token, orderId)

      res.locals.subscribers = subscribers
    } catch (error) {
      return next(error)
    }
  }
  next()
}

async function setQuoteSummary (req, res, next) {
  const orderId = get(res.locals, 'order.id')
  const orderStatus = get(res.locals, 'order.status')

  if (orderStatus === 'quote_awaiting_acceptance') {
    try {
      const quote = await Order.getQuote(req.session.token, orderId)
      quote.expires_on = new Date(quote.expires_on + 'T23:59:59')

      res.locals.quote = assign({}, quote, {
        expired: quote.expires_on < new Date(),
      })
    } catch (error) {
      logger.error(error)
    }
  }

  next()
}

async function setQuotePreview (req, res, next) {
  if (!get(res.locals, 'order')) {
    return next()
  }

  const { id, status } = res.locals.order

  if (status !== 'draft') {
    return next()
  }

  try {
    const quote = await Order.previewQuote(req.session.token, id)
    quote.expires_on = new Date(quote.expires_on + 'T23:59:59')

    res.locals.quote = quote
  } catch (error) {
    if (error.statusCode !== 400) {
      logger.error(error)
      return next()
    }

    const quoteErrors = mapValues(editSteps, (step) => {
      if (!step.fields) { return false }

      const stepErrors = filter(step.fields, (field) => {
        return error.error.hasOwnProperty(field)
      })

      if (!stepErrors.length) { return false }

      return {
        heading: step.heading,
        errors: stepErrors,
      }
    })

    delete quoteErrors['/vat-status']

    res.locals.missingLeadAssignee = error.error.hasOwnProperty('assignee_lead')
    res.locals.incompleteFields = pickBy(quoteErrors)
  }

  next()
}

async function setQuote (req, res, next) {
  if (res.locals.quote) {
    return next()
  }

  try {
    const quote = await Order.getQuote(req.session.token, res.locals.order.id)
    quote.expires_on = new Date(quote.expires_on + 'T23:59:59')

    res.locals.quote = assign({}, quote, {
      expired: quote.expires_on < new Date(),
    })
  } catch (error) {
    if (error.statusCode !== 404) {
      logger.error(error)
    }
  }

  next()
}

async function setInvoice (req, res, next) {
  try {
    res.locals.invoice = await Order.getInvoice(req.session.token, res.locals.order.id)
  } catch (error) {
    logger.error(error)
  }

  next()
}

async function setPayments (req, res, next) {
  try {
    const payments = await Order.getPayments(req.session.token, res.locals.order.id)

    res.locals.payments = payments.map(transformPaymentToView)
  } catch (error) {
    logger.error(error)
  }

  next()
}

async function generateQuote (req, res, next) {
  const orderId = get(res.locals, 'order.id')
  const clientEmail = get(res.locals, 'order.contact.email') || 'client'

  try {
    await Order.createQuote(req.session.token, orderId)

    req.flash('success', `Quote sent ${clientEmail}`)
    res.redirect(`/omis/${orderId}`)
  } catch (error) {
    const errorCode = error.statusCode

    if (errorCode === 400) {
      req.flash('error', 'Quote could not be sent to client. Some fields were missing.')
      return res.redirect(`/omis/${orderId}`)
    }

    if (errorCode === 409) {
      req.flash('error', 'Quote could not be sent to client. A valid quote already exists.')
      return res.redirect(`/omis/${orderId}`)
    }

    next(error)
  }
}

async function cancelQuote (req, res, next) {
  const orderId = get(res.locals, 'order.id')

  try {
    await Order.cancelQuote(req.session.token, orderId)

    req.flash('success', 'Quote successfully cancelled.')
    res.redirect(`/omis/${orderId}`)
  } catch (error) {
    if (error.statusCode === 404) {
      req.flash('error', 'The quote does not exist so could not be cancelled.')
      return res.redirect(`/omis/${orderId}/quote`)
    }

    if (error.statusCode === 409) {
      req.flash('error', 'Quote could not be cancelled. It has already been accepted.')
      return res.redirect(`/omis/${orderId}/quote`)
    }

    next(error)
  }
}

function setQuoteForm (req, res, next) {
  const quote = res.locals.quote
  const orderId = get(res.locals, 'order.id')
  const orderStatus = get(res.locals, 'order.status')
  const form = {
    buttonText: `Send quote to client`,
    returnText: 'Return to order',
    returnLink: `/omis/${orderId}`,
  }

  if (res.locals.incompleteFields || ['cancelled'].includes(orderStatus)) {
    form.hidePrimaryFormAction = true
  }

  if (get(quote, 'created_on') && !get(quote, 'cancelled_on')) {
    form.action = `/omis/${orderId}/quote/cancel`
    form.buttonText = 'Withdraw quote'
    form.buttonModifiers = 'button--destructive'
    res.locals.destructive = true

    if (quote.accepted_on) {
      form.hidePrimaryFormAction = true
    }
  }

  res.locals.quoteForm = form
  next()
}

module.exports = {
  setTranslation,
  setCompany,
  setContact,
  setAssignees,
  setSubscribers,
  setQuoteSummary,
  setQuotePreview,
  setQuote,
  setInvoice,
  setPayments,
  generateQuote,
  cancelQuote,
  setQuoteForm,
}
