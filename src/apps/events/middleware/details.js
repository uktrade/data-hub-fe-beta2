const { assign } = require('lodash')

const {
  transformEventResponseToViewRecord,
  transformEventFormBodyToApiRequest,
} = require('../transformers')
const { fetchEvent, saveEvent } = require('../repos')

async function postDetails(req, res, next) {
  res.locals.requestBody = transformEventFormBodyToApiRequest(req.body)
  if (req.body.add_team || req.body.add_related_programme) {
    return next()
  }

  try {
    const result = await saveEvent(req, res.locals.requestBody)

    if (!res.locals.event) {
      req.flash('success', 'Event created')
    }
    return res.redirect(`/events/${result.id}`)
  } catch (err) {
    if (err.response.status === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.response.data,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getEventDetails(req, res, next, eventId) {
  try {
    res.locals.event = await fetchEvent(req, eventId)
    res.locals.eventViewRecord = transformEventResponseToViewRecord(
      res.locals.event
    )
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getEventDetails,
  postDetails,
}
