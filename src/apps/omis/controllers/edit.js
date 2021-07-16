const {
  find,
  flatten,
  get,
  isEmpty,
  isNull,
  isPlainObject,
  isUndefined,
  map,
  mapValues,
  pick,
  pickBy,
} = require('lodash')

const FormController = require('./form')
const { Order } = require('../models')
const { formatLongDate, isDateValid } = require('../../../common/date')

class EditController extends FormController {
  async saveValues(req, res, next) {
    try {
      await Order.update(req, res.locals.order.id, req.form.values)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req, res) {
    req.journeyModel.reset()
    req.journeyModel.destroy()
    req.sessionModel.reset()
    req.sessionModel.destroy()

    if (!isEmpty(req.form.options.successMessage)) {
      req.flash('success', req.form.options.successMessage)
    }
    res.redirect(this.getNextStep(req, res))
  }

  getValues(req, res, next) {
    const sessionValues = req.sessionModel.toJSON()
    const errorValues = pick(
      sessionValues.errorValues,
      Object.keys(req.form.options.fields)
    )

    delete sessionValues.errorValues
    delete sessionValues.errors

    const dateFields = ['delivery_date']

    const orderValues = mapValues(
      req.form.options.fields,
      (fieldOptions, key) => {
        const newValue = get(res.locals, `order.${key}`)

        if (isPlainObject(newValue)) {
          return get(newValue, 'id')
        }

        if (find(newValue, 'id')) {
          return map(newValue, 'id')
        }

        if (find(newValue, 'adviser')) {
          return map(newValue, 'adviser.id')
        }

        if (fieldOptions.repeatable) {
          return flatten([newValue])
        }

        if (dateFields.includes(key) && newValue && isDateValid(newValue)) {
          return formatLongDate(newValue)
        }

        return newValue
      }
    )

    // combine order values and error values
    const combinedValues = Object.assign(
      {},
      orderValues,
      sessionValues,
      errorValues
    )

    const filtered = pickBy(combinedValues, (value) => {
      return !isUndefined(value) && !isNull(value)
    })

    next(null, filtered)
  }
}

module.exports = EditController
