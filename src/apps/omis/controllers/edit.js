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
const {
  parseDate,
  isUnparsedDateValid,
  formatDateWithoutParsing,
} = require('../../../common/date')

const FormController = require('./form')
const { DATE_LONG_FORMAT } = require('../../../common/constants')
const { Order } = require('../models')

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

        const parsedDate = parseDate(newValue)
        if (
          dateFields.includes(key) &&
          newValue &&
          isUnparsedDateValid(parsedDate)
        ) {
          return formatDateWithoutParsing(parsedDate, DATE_LONG_FORMAT, false)
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
