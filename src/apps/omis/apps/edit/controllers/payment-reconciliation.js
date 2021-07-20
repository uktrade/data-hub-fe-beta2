const { assign, get } = require('lodash')
const numeral = require('numeral')
const chrono = require('chrono-node')
const { formatDate } = require('../../../../../common/date')

const logger = require('../../../../../config/logger')
const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class EditPaymentReconciliationController extends EditController {
  async configure(req, res, next) {
    const orderStatus = get(res.locals, 'order.status')

    req.form.options = assign({}, req.form.options, {
      disableFormAction: false,
      buttonText: 'Reconcile payment',
      successMessage: `Payment for ${res.locals.order.reference} reconciled`,
      next: `/omis/reconciliation/${res.locals.order.id}/payment-receipt`,
    })

    if (orderStatus !== 'quote_accepted') {
      req.form.options.hidePrimaryFormAction = true
      req.form.options.returnText = 'Return'
    }

    super.configure(req, res, next)
  }

  process(req, res, next) {
    const paymentDateStr = req.body.received_on
    const parsedDate = chrono.en.GB.parseDate(paymentDateStr)

    if (parsedDate) {
      req.form.values.received_on = formatDate(parsedDate, 'yyyy-MM-dd')
    } else {
      req.form.values.received_on = paymentDateStr
    }

    next()
  }

  validate(req, res, next) {
    const submittedAmount = numeral(req.form.values.amount).value()
    const totalCost = res.locals.order.total_cost

    if (submittedAmount < totalCost) {
      const error = { key: 'amount', type: 'greaterthanamount' }
      const errors = {
        amount: new this.Error('amount', error, req, res),
      }

      return next(errors)
    }

    next()
  }

  async getValues(req, res, next) {
    let invoice

    try {
      invoice = await Order.getInvoice(req, res.locals.order.id)
    } catch (error) {
      logger.error(error)
    }

    super.getValues(req, res, (err, values) => {
      next(
        err,
        assign({}, values, {
          invoice,
        })
      )
    })
  }

  async saveValues(req, res, next) {
    const data = req.form.values
    const penceAmount = Math.round(numeral(data.amount).value() * 100)

    data.amount = penceAmount

    try {
      // TODO: Support adding of multiple payments
      // API accepts an array of payment objects
      // This solution sends the only payment captured in an array to solve this
      await Order.savePayments(req, res.locals.order.id, [data])
      next()
    } catch (err) {
      if (err.statusCode === 409) {
        req.flash('error', err.error.detail)
        return res.redirect(req.form.options.next)
      }

      next(err)
    }
  }
}

module.exports = EditPaymentReconciliationController
