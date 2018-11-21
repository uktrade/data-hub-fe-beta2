const faker = require('faker')
const { addWeeks, format } = require('date-fns')
const { get, camelCase, isNull, pickBy, keys, assign } = require('lodash')

const { getButtonWithText } = require('../../helpers/selectors')
const { getDateFor } = require('../../helpers/date')
const { appendUid, getUid } = require('../../helpers/uuid')

module.exports = {
  url: `${process.env.QA_HOST}/events/create`,
  props: {},
  elements: {
    eventName: 'input[name="name"]',
    nameError: 'label[for=field-name] span:nth-child(2)',
    eventType: 'select[name="event_type"]',
    typeError: 'label[for=field-event_type] span:nth-child(2)',
    startDateYear: 'input[name="start_date_year"]',
    startDateMonth: 'input[name="start_date_month"]',
    startDateDay: 'input[name="start_date_day"]',
    startDateError: '#group-field-start_date span:nth-child(2)',
    endDateYear: 'input[name="end_date_year"]',
    endDateMonth: 'input[name="end_date_month"]',
    endDateDay: 'input[name="end_date_day"]',
    endDateError: '#group-field-end_date span:nth-child(2)',
    locationType: 'select[name="location_type"]',
    addressLine1: 'input[name="address_1"]',
    addressLine1Error: 'label[for=field-address_1] span:nth-child(2)',
    addressLine2: 'input[name="address_2"]',
    addressTown: 'input[name="address_town"]',
    addressTownError: 'label[for=field-address_town] span:nth-child(2)',
    addressCounty: 'input[name="address_county"]',
    addressPostcode: 'input[name="postcode"]',
    addressCountry: 'select[name="address_country"]',
    addressCountryError: 'label[for=field-address_country] span:nth-child(2)',
    ukRegion: 'select[name="uk_region"]',
    ukRegionError: 'label[for=field-uk_region] span:nth-child(2)',
    notes: 'textarea[name="notes"]',
    service: 'select[name="service"]',
    serviceError: 'label[for=field-service] span:nth-child(2)',
    leadTeam: 'select[name="lead_team"]',
    organiser: 'select[name="organiser"]',
    sharedYes: 'label[for=field-event_shared-1]',
    sharedNo: 'label[for=field-event_shared-2]',
    teams: '#field-teams',
    addAnotherSharedTeam: 'input[name="add_team"]',
    relatedProgrammes: '#field-related_programmes',
    addAnotherProgramme: 'input[name="add_related_programme"]',
    saveButton: getButtonWithText('Add event'),
  },
  commands: [
    {
      selectListOption (listName, optionNumber) {
        return this
          .click(`select[name="${listName}"] option:nth-child(${optionNumber})`)
      },
      assertVisibleTeamsList (listNumber) {
        return this
          .assert.visible('#group-field-teams #group-field-teams:nth-child(' + listNumber + ') select')
      },
      assertVisibleRelatedProgrammesList (listNumber) {
        return this
          .assert.visible('#group-field-related_programmes #group-field-related_programmes:nth-child(' + listNumber + ') select')
      },
      populateCreateEventForm (details = {}, selectUkRegion, callback) {
        const today = new Date()
        const futureDate = addWeeks(today, 1)
        const event = assign({}, {
          name: appendUid(faker.company.companyName()),
          address_1: faker.address.streetName(),
          address_2: faker.address.secondaryAddress(),
          address_town: faker.address.city(),
          postcode: faker.address.zipCode(),
          start_date_year: format(new Date(), 'YYYY'),
          start_date_month: format(new Date(), 'MM'),
          start_date_day: format(new Date(), 'D'),
          end_date_year: format(futureDate, 'YYYY'),
          end_date_month: format(futureDate, 'MM'),
          end_date_day: format(futureDate, 'D'),
          notes: faker.lorem.sentence(),
          location_type: null,
          service: null,
          event_type: null,
          address_country: null,
          organiser: null,
          lead_team: null,
          related_programmes: null,
          teams: null,
        }, details)

        return this
          .waitForElementPresent('@sharedYes')
          .click('@sharedYes')
          .api.perform((done) => {
            Promise.all(
              keys(pickBy(event, isNull)).map((key) => {
                return new Promise((resolve) => {
                  const selector = `@${camelCase(key)}`
                  this
                    .waitForElementPresent(selector)
                    .getListOption(selector, (optionText) => {
                      event[key] = optionText.trim()
                      resolve()
                    })
                })
              })
            )
              .then(() => {
                if (event.address_country === 'United Kingdom' && selectUkRegion) {
                  return new Promise((resolve) => {
                    this
                      .waitForElementPresent('@ukRegion')
                      .getListOption('@ukRegion', (ukRegion) => {
                        event.uk_region = ukRegion
                        resolve()
                      })
                  })
                }
              })
              .then(() => {
                for (const key in event) {
                  if (event[key]) {
                    const selector = `[name="${key}"]`
                    this
                      .waitForElementPresent(selector)
                      .setValue(selector, event[key])
                  }
                }
                done()
              })
          })
          .perform(() => {
            const eventWithDates = assign({}, event, {
              startDate: getDateFor({
                year: get(event, 'start_date_year'),
                month: get(event, 'start_date_month'),
                day: get(event, 'start_date_day'),
              }),
              endDate: getDateFor({
                year: get(event, 'end_date_year'),
                month: get(event, 'end_date_month'),
                day: get(event, 'end_date_day'),
              }),
              uniqueSearchTerm: getUid(event.name),
            })

            callback(eventWithDates)
          })
      },
    },
  ],
}
