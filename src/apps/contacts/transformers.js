/* eslint-disable camelcase */
const { pickBy } = require('lodash')

const { getDataLabels } = require('../../lib/controller-utils')
const { contactDetailsLabels } = require('./labels')

function getContactAddress(
  address_same_as_company,
  contactAddressFields,
  company
) {
  return address_same_as_company
    ? company.address
    : {
        line_1: contactAddressFields.address_1,
        line_2: contactAddressFields.address_2,
        town: contactAddressFields.address_town,
        county: contactAddressFields.address_county,
        postcode: contactAddressFields.address_postcode,
        country: contactAddressFields.address_country,
      }
}

function getTelephoneNumber(telephone_countrycode, telephone_number) {
  return telephone_countrycode
    ? `(${telephone_countrycode}) ${telephone_number}`
    : telephone_number
}

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @param {object} company
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function transformContactToView(
  {
    telephone_countrycode,
    telephone_number,
    job_title,
    email,
    accepts_dit_email_marketing,
    address_1,
    address_2,
    address_town,
    address_county,
    address_postcode,
    address_country,
    telephone_alternative,
    email_alternative,
    notes,
    address_same_as_company,
  },
  company
) {
  const viewRecord = {
    job_title,
    email,
    telephone_alternative,
    email_alternative,
    notes,
    telephone_number: getTelephoneNumber(
      telephone_countrycode,
      telephone_number
    ),
    email_marketing: accepts_dit_email_marketing
      ? 'Can be marketed to'
      : 'Cannot be marketed to',
    address: {
      type: 'address',
      address: getContactAddress(
        address_same_as_company,
        {
          address_1,
          address_2,
          address_town,
          address_county,
          address_postcode,
          address_country,
        },
        company
      ),
    },
  }

  return pickBy(getDataLabels(viewRecord, contactDetailsLabels))
}

module.exports = {
  transformContactToView,
}
