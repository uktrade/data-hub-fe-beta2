const { get, sortBy, isString } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')
const { Order } = require('../../../models')

class EditAssigneesController extends EditController {
  async configure(req, res, next) {
    try {
      const orderId = get(res.locals, 'order.id')
      const canEditOrder = get(res.locals, 'order.canEditOrder')
      const canEditAdvisers = get(res.locals, 'order.canEditAdvisers')
      const token = get(req.session, 'token')
      const advisers = await getAdvisers(token)
      const assignees = await Order.getAssignees(token, orderId)
      const options = advisers.results.map(transformObjectToOption)

      req.form.options.fields.assignees.options = sortBy(options, 'label')
      req.form.options.fields.assignees.canRemove = canEditOrder
      req.form.options.disableFormAction = !canEditAdvisers

      res.locals.order.assignees = assignees

      req.form.options.fields.assignees.children.forEach((item) => {
        item.options.push(...options)
      })

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async saveValues(req, res, next) {
    const data = req.form.values
    const assigneesArray = isString(data.assignees)
      ? [data.assignees]
      : data.assignees
    const assignees = assigneesArray.map((id) => {
      return {
        adviser: { id },
      }
    })

    try {
      const orderId = get(res.locals, 'order.id')
      const canEditOrder = get(res.locals, 'order.canEditOrder')
      const token = get(req.session, 'token')

      if (canEditOrder) {
        await Order.forceSaveAssignees(token, orderId, assignees)
      } else {
        await Order.saveAssignees(token, orderId, assignees)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditAssigneesController
