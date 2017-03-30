/* eslint new-cap: 0 */
const express = require('express')
const moment = require('moment')

const router = express.Router()

function getContacts (req, res) {
  res.locals.tab = 'contacts'
  const company = res.locals.company

  // build the data for the contact table.

  res.locals.contacts = company.contacts
    .filter(contact => !contact.archived)
    .map((contact) => {
      return {
        url: `/contact/${contact.id}/details`,
        name: `${contact.first_name} ${contact.last_name}`,
        job_title: contact.job_title,
        phone: formatPhone(contact),
        email: contact.email,
        added: moment(contact.created_on).format('DD MMMM YYYY')
      }
    })

  res.locals.contactsArchived = company.contacts
    .filter(contact => contact.archived === true)
    .map((contact) => {
      return {
        url: `/contact/${contact.id}/details`,
        name: `${contact.first_name} ${contact.last_name}`,
        job_title: contact.job_title,
        reason: contact.archived_reason
      }
    })

  res.locals.addContactUrl = `/contact/add?company=${res.locals.company.id}`
  res.render('company/contacts')
}

function formatPhone (contact) {
  const countryCode = (contact.telephone_countrycode && contact.telephone_countrycode.length > 0) ? contact.telephone_countrycode : null
  const telephoneNumber = (contact.telephone_number && contact.telephone_number.length > 0) ? contact.telephone_number : null

  if (!countryCode) {
    return telephoneNumber
  }

  if (countryCode && telephoneNumber && telephoneNumber.charAt(0) === '0') {
    return `${countryCode} ${telephoneNumber.substr(1)}`
  }

  if (countryCode && telephoneNumber && telephoneNumber.charAt(0) !== '0') {
    return `${countryCode} ${telephoneNumber}`
  }
}

router.get('/company/:source/:sourceId/contacts', getContacts)

module.exports = { getContacts, router }
