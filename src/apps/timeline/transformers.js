/* eslint camelcase: 0 */
const dateFns = require('date-fns')
const { mediumDateFormat } = require('../../../config')

const { listLabels } = require('./labels')

function transformTimelineToListItem ({ data_source_label, datetime, description }) {
  return {
    type: 'timeline',
    name: dateFns.format(datetime, mediumDateFormat),
    contentMetaModifier: 'stacked',
    meta: [{
      label: listLabels.data_source,
      value: data_source_label,
    }, {
      label: listLabels.description,
      value: description,
    }],
  }
}

module.exports = { transformTimelineToListItem }
