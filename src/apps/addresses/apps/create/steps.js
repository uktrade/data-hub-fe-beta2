const {
  manualUkAddressForm,
  overseasAddressForm,
  postcodeLookupForm,
  selectUkAddressForm,
  ukOrOverseasForm,
} = require('../../macros')
const {
  setAddresses,
  setCountries,
} = require('./middleware')
const api = require('./api')

module.exports = {
  breadcrumbs: [
    { name: 'Add an address', url: '/address-type' },
  ],
  steps: [
    {
      type: 'form',
      path: '/address-type',
      heading: 'Is this a UK or overseas address?',
      macro: ukOrOverseasForm,
      nextPath: ({ uk_or_overseas: ukOrOverseas }) => {
        const path = {
          uk: '/postcode-lookup',
          overseas: '/overseas-address',
        }

        return path[ukOrOverseas]
      },
    },
    {
      type: 'form',
      path: '/postcode-lookup',
      heading: 'Add a company address',
      macro: postcodeLookupForm,
      nextPath: '/select-uk-address',
    },
    {
      type: 'form',
      path: '/select-uk-address',
      heading: 'Add a company address',
      middleware: [
        setAddresses,
      ],
      macro: selectUkAddressForm,
      done: {
        send: api.send,
        message: 'Address has been added',
        nextPath: ({ id }) => `/addresses/${id}`,
      },
    },
    {
      type: 'form',
      path: '/manual-uk-address',
      heading: 'Add a company address',
      macro: manualUkAddressForm,
      validateJourney: false,
      done: {
        send: api.send,
        message: 'Address has been added',
        nextPath: ({ id }) => `/addresses/${id}`,
      },
    },
    {
      type: 'form',
      path: '/overseas-address',
      heading: 'Add a company address',
      middleware: [
        setCountries,
      ],
      macro: overseasAddressForm,
      done: {
        send: api.send,
        message: 'Address has been added',
        nextPath: ({ id }) => `/addresses/${id}`,
      },
    },
  ],
}
