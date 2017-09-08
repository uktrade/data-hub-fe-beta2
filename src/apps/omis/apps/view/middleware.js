const { get, keys } = require('lodash')
const path = require('path')
const i18nFuture = require('i18n-future')

const { setHomeBreadcrumb } = require('../../../middleware')
const { Order } = require('../../models')

const i18n = i18nFuture({
  path: path.resolve(__dirname, '../../locales/__lng__/__ns__.json'),
})

function setOrderBreadcrumb (req, res, next) {
  const reference = get(res.locals, 'order.reference')

  return setHomeBreadcrumb(reference)(req, res, next)
}

function setTranslation (req, res, next) {
  res.locals.translate = (key) => {
    return i18n.translate(key)
  }
  next()
}

async function getQuote (req, res, next) {
  try {
    const orderId = get(res.locals, 'order.id')
    res.locals.quote = await Order.getQuote(req.session.token, orderId)
    next()
  } catch (error) {
    if (error.statusCode === 404) {
      res.locals.quote = {}
      return next()
    }

    next(error)
  }
}

async function generateQuote (req, res, next) {
  const orderId = get(res.locals, 'order.id')

  try {
    await Order.createQuote(req.session.token, orderId)

    req.flash('success', 'Quote successfully generated.')
    res.redirect(`/omis/${orderId}`)
  } catch (error) {
    const errorCode = error.statusCode

    if (errorCode === 400) {
      req.flash('error', 'Quote could not be generated. Some fields were missing.')
      return res.redirect(`/omis/${orderId}`)
    }

    if (errorCode === 409) {
      req.flash('error', 'Quote could not be generated. A valid quote already exists.')
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
  const form = {
    buttonText: 'Generate and send quote',
    returnText: 'Return to order',
    returnLink: `/omis/${orderId}`,
  }

  if (quote.expires_on) {
    form.action = `/omis/${orderId}/quote/cancel`
    form.buttonText = 'Cancel quote'
    form.buttonModifiers = 'button-secondary'

    if (quote.accepted_on || quote.cancelled_on) {
      form.disableFormAction = true
    }

    if (new Date(quote.expires_on) > new Date()) {
      form.buttonModifiers = 'button--destructive'

      res.locals.destructive = true
    }
  }

  res.locals.quoteForm = form
  next()
}

module.exports = {
  setOrderBreadcrumb,
  setTranslation,
  getQuote,
  generateQuote,
  cancelQuote,
  setQuoteForm,
}
