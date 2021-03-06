/* eslint-disable camelcase */
const { find, get } = require('lodash')

const { ORDER_STATES } = require('./constants')

function transformOrderToListItem({
  id,
  reference,
  status,
  company,
  contact,
  primary_market,
  uk_region,
  delivery_date,
  modified_on,
  created_on,
  sector,
} = {}) {
  if (!id || !reference) {
    return
  }

  const orderState = find(ORDER_STATES, { value: status })

  const item = {
    id,
    type: 'order',
    urlPrefix: 'omis/',
    name: reference,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    meta: [
      {
        label: 'Status',
        type: 'badge',
        value: get(orderState, 'label'),
      },
      {
        label: 'Market',
        type: 'badge',
        value: get(primary_market, 'name'),
      },
      {
        label: 'Company',
        value: get(company, 'name'),
      },
      {
        label: 'Created',
        type: 'datetime',
        value: created_on,
      },
      {
        label: 'Contact',
        value: get(contact, 'name'),
      },
      {
        label: 'UK region',
        value: uk_region,
      },
      {
        label: 'Sector',
        value: sector,
      },
    ],
  }

  if (delivery_date) {
    item.meta.push({
      label: 'Delivery date',
      type: 'date',
      value: delivery_date,
    })
  }

  return item
}

function transformOrderToTableItem({
  id,
  reference,
  payment_due_date,
  company,
  subtotal_cost,
  total_cost,
} = {}) {
  if (!id || !reference) {
    return
  }

  return {
    id,
    reference,
    payment_due_date,
    company: get(company, 'name'),
    subtotal_cost: parseInt(subtotal_cost) / 100,
    total_cost: parseInt(total_cost) / 100,
  }
}

function transformPaymentToView({
  reference,
  created_on,
  transaction_reference,
  additional_reference,
  amount,
  method,
  received_on,
} = {}) {
  if (!reference) {
    return
  }

  return {
    reference,
    created_on,
    transaction_reference,
    additional_reference,
    method,
    received_on,
    amount: parseFloat(amount) / 100,
  }
}

function transformSubscriberToView(currentUserId) {
  return function ({ name, id, dit_team } = {}) {
    if (!id) {
      return
    }

    const ukTeam = get(dit_team, 'uk_region.name')
    const teamLabel = ukTeam ? `, ${ukTeam}` : ''
    const youLabel = id === currentUserId ? ' (you)' : ''

    return [name, teamLabel, youLabel].join('')
  }
}

module.exports = {
  transformOrderToListItem,
  transformOrderToTableItem,
  transformPaymentToView,
  transformSubscriberToView,
}
