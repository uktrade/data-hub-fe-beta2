const { assign } = require('lodash')

const labels = require('../labels')
const {
  tag,
  documentUpload,
  comment,
} = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  hiddenFields,
  tags = [],
}) {
  return {
    enctype: 'multipart/form-data',
    returnLink, // TODO (jf): fix return link
    returnText,
    buttonText,
    hiddenFields,
    children: [
      tag(tags),
      documentUpload,
      comment,
    ].map(field => {
      return assign(field, {
        label: labels.evidenceForm[field.name],
      })
    }),
  }
}
