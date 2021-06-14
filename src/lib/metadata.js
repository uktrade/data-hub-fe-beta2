const config = require('../config')
const logger = require('../config/logger')
const hawkRequest = require('../lib/hawk-request')

let redisClient

function getMetadata(path, key) {
  const url = `${config.apiRoot}/v4/metadata/${path}`

  if (redisClient) {
    return new Promise((resolve, reject) => {
      const ttl = config.redis.metadataTtl

      redisClient.get(url, (err, data) => {
        if (!err && data) {
          data = JSON.parse(data)
          module.exports[key] = data
          resolve(data)
        } else {
          hawkRequest(url)
            .then((responseData) => {
              module.exports[key] = responseData
              redisClient.setex(url, ttl, JSON.stringify(responseData))
              resolve(responseData)
            })
            .catch((reponseError) => {
              logger.error('Error fetching metadataRepository for url: %s', url)
              reject(reponseError)
              throw reponseError
            })
        }
      })
    })
  }

  return hawkRequest(url)
    .then((responseData) => {
      module.exports[key] = responseData
      return responseData
    })
    .catch((err) => {
      logger.error('Error fetching metadataRepository for url: %s', url)
      throw err
    })
}

module.exports.getMetadataItem = function (table, id) {
  const url = `${config.apiRoot}/v4/metadata/${table}`

  return new Promise((resolve, reject) => {
    hawkRequest(url)
      .then((data) => {
        data.forEach((item) => {
          if (item.id === id) {
            resolve(item)
          }
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const metadataItems = [
  ['programme', 'programmeOptions'],
  ['event-type', 'eventTypeOptions'],
  ['location-type', 'locationTypeOptions'],
  ['sector', 'sectorOptions'],
  ['turnover', 'turnoverOptions'],
  ['uk-region', 'regionOptions'],
  ['administrative-area', 'administrativeAreaOptions'],
  ['country', 'countryOptions'],
  ['employee-range', 'employeeOptions'],
  ['evidence-tag', 'evidenceTagOptions'],
  ['business-type', 'businessTypeOptions'],
  ['team', 'teams'],
  ['communication-channel', 'communicationChannelOptions'],
  ['service', 'serviceDeliveryServiceOptions'],
  ['headquarter-type', 'headquarterOptions'],
  ['referral-source-activity', 'referralSourceActivityOptions'],
  ['referral-source-marketing', 'referralSourceMarketingOptions'],
  ['referral-source-website', 'referralSourceWebsiteOptions'],
  ['investment-business-activity', 'businessActivityOptions'],
  ['investment-type', 'investmentTypeOptions'],
  ['investment-project-stage', 'investmentProjectStage'],
  ['fdi-type', 'fdiOptions'],
  ['salary-range', 'salaryRangeOptions'],
  ['investment-strategic-driver', 'strategicDriverOptions'],
  ['investment-project-stage', 'investmentStageOptions'],
  ['order-service-type', 'orderServiceTypesOptions'],
  ['order-cancellation-reason', 'orderCancellationReasons'],
  ['omis-market', 'omisMarketOptions'],
  ['fdi-value', 'fdiValueOptions'],
  ['investment-specific-programme', 'investmentSpecificProgrammeOptions'],
  ['investment-investor-type', 'investmentInvestorTypeOptions'],
  ['investment-involvement', 'investmentInvolvementOptions'],
  ['export-experience-category', 'exportExperienceCategory'],
  ['likelihood-to-land', 'likelihoodToLandOptions'],
  ['trade-agreement', 'tradeAgreementOptions'],
]

const restrictedServiceKeys = [
  'Account Management',
  'Bank Referral',
  'Digital Trade Advisers One-to-One',
  'Events – Overseas',
  'Events - UK Based',
  'Events – Webinars',
  'First Time Exporters - Export Insight Visits',
  'First Time Exporters – Export Savvy',
  'Language and Culture Advisers One-to-One',
  'Market Selection Service (MSS)',
  'Market Visit Support (MVS)',
  'Onward Referral',
  'Open to Export Assist (OtE)',
  'Outward Missions',
  'Overseas Business Network Advisers One-to-One',
  'Overseas Market Introduction Service (OMIS)',
  'Postgraduates for International Business - Placement',
  'Significant Assistance (PIMS)',
  'Trade - ECR Web Action Plan',
  'UK Region Local]',
]

module.exports.setRedisClient = (client) => {
  redisClient = client
}

module.exports.fetchAll = (cb) => {
  // todo
  // refactor to create an array of jobs to do and then use promise all
  // before returning back via a promise.

  let caughtErrors
  let totalRequests = 0
  let completeRequests = 0

  function checkResults() {
    completeRequests += 1
    if (completeRequests === totalRequests) {
      logger.info('All metadataRepository requests complete')
      cb(caughtErrors)
    }
  }

  for (const item of metadataItems) {
    totalRequests += 1
    getMetadata(item[0], item[1])
      .then((data) => {
        if (item[2]) {
          item[2](data)
        }

        checkResults()
      })
      .catch((err) => {
        caughtErrors = caughtErrors || []
        caughtErrors.push(err)
        checkResults()
      })
  }
}

module.exports.REASONS_FOR_ARCHIVE = ['Company is dissolved', 'Other']

// Todo - Move to metadata repo in back end
module.exports.investmentStatusOptions = [
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Dormant', value: 'dormant' },
]

module.exports.getServices = function () {
  return hawkRequest(`${config.apiRoot}/v4/metadata/service`)
}

module.exports.initialiseRestrictedServiceOptions = function () {
  hawkRequest(`${config.apiRoot}/v4/metadata/service`).then((data) => {
    module.exports.serviceDeliveryServiceOptions = data.filter((service) =>
      restrictedServiceKeys.includes(service.name)
    )
  })
}

module.exports.getIdForName = function (options, name) {
  if (!name) return null
  const _name = name.toLowerCase()
  for (const option of options) {
    if (_name === option.name.toLowerCase()) {
      return option
    }
  }
}
