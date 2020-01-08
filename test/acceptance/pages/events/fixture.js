const { find } = require('lodash')

const { event } = require('../../fixtures')

module.exports = {
  url: function eventFixtureUrl(eventName) {
    const fixture = find(event, { name: eventName })
    const eventId = fixture ? fixture.id : event.oneDayExhibition.id

    return `${process.env.QA_HOST}/events/${eventId}`
  },
  elements: {},
}
