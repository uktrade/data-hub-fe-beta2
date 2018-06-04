const { assign } = require('lodash')

const labels = require('../labels')
const {
  complete,
} = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  hiddenFields,
}) {
  return {
    returnLink,
    returnText,
    buttonText: 'Complete proposition',
    hiddenFields,
    children: [
      complete,
    ].map(field => {
      return assign(field, {
        label: (function () {
          return labels.completeProposition[field.name]
        })(),
      })
    }),
  }
}
