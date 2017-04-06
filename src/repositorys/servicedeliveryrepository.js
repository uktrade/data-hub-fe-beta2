const winston = require('winston')
const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')

function saveServiceDelivery (token, serviceDelivery) {
  const options = {
    body: serviceDelivery
  }

  if (serviceDelivery.data.id && serviceDelivery.data.id.length > 0) {
    options.url = `${config.apiRoot}/v2/service-delivery/${serviceDelivery.id}/`
    options.method = 'PUT'
  } else {
    options.url = `${config.apiRoot}/v2/service-delivery/`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

function getServiceDelivery (token, serviceDeliveryId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/${serviceDeliveryId}/`)
    .then((response) => {
      resolve(response.dat)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

function getServiceDeliverysForCompany (token, companyId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?company=${companyId}`)
    .then((response) => {
      resolve(response.dat)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

function getServiceDeliverysForContact (token, companyId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?contact=${companyId}`)
    .then((response) => {
      resolve(response.dat)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

module.exports = {
  getServiceDelivery,
  saveServiceDelivery,
  getServiceDeliverysForCompany,
  getServiceDeliverysForContact
}
