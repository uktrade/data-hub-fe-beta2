const { get, omit, merge } = require('lodash')
const { eventFiltersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getAdvisers } = require('../../adviser/repos')

async function renderEventList (req, res, next) {
  try {
    const token = req.session.token
    const advisers = await getAdvisers(req.session.token)
    const filtersFields = eventFiltersFields({ advisers: advisers, userAgent: res.locals.userAgent })
    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    const sortForm = merge({}, eventSortForm, {
      hiddenFields: omit(req.query, 'sortby'),
      children: [
        { value: req.query.sortby },
      ],
    })

    res.render('_layouts/collection', {
      sortForm,
      filtersFields: filtersFieldsWithSelectedOptions,
      selectedFilters,
      title: 'Events',
      countLabel: 'event',
      highlightTerm: get(selectedFilters, 'name.valueLabel'),
      actionButtons: [{
        label: 'Add event',
        url: '/events/create',
      }],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEventList,
}
