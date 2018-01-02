const { assign, flatten, get, isEmpty } = require('lodash')

const { transformToApi, transformFromApi } = require('../../services/formatting')
const { isValidGuid } = require('../../../../lib/controller-utils')
const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { getOptions } = require('../../../../lib/options')
const {
  buildMetaDataObj,
  transformObjectToOption,
  transformContactToOption,
} = require('../../../transformers')
const {
  createInvestmentProject,
  getEquityCompanyDetails,
  updateInvestment,
} = require('../../repos')

async function populateForm (req, res, next) {
  const clientCompanyId = req.query['client-company']
  const equityCompanyId = get(res, 'locals.equityCompany.id', req.params.equityCompanyId)

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect('/investment-projects/create')
  }

  try {
    const investmentData = transformFromApi(res.locals.investmentData)
    const createdOn = get(investmentData, 'created_on')
    const token = req.session.token

    const {
      equityCompany,
      equityCompanyInvestment,
    } = await getEquityCompanyDetails(token, equityCompanyId)

    const contacts = get(equityCompany, 'contacts', []).map(transformContactToOption)

    const activeInvestmentTypes = await getOptions(token, 'investment-type', { createdOn })
    const investmentTypes = activeInvestmentTypes.filter((investmentType) => {
      return get(equityCompany, 'uk_based') || investmentType.label.toLowerCase().includes('fdi')
    })

    const referralSourceActivities = await getOptions(token, 'referral-source-activity', { createdOn })

    const state = assign({}, {
      client_contacts: [''],
      business_activities: [''],
    }, investmentData)

    const advisersResponse = await getAdvisers(token)

    const clientRelationshipManagers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: get(investmentData, 'client_relationship_manager'),
    }).map(transformObjectToOption)

    const referralSourceAdvisers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: get(investmentData, 'referral_source_adviser'),
    }).map(transformObjectToOption)

    res.locals.clientCompanyId = clientCompanyId || equityCompanyId
    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment

    res.locals.form = assign({}, res.locals.form, {
      state,
      options: {
        clientRelationshipManagers,
        referralSourceAdvisers,
        contacts,
        investmentTypes,
        referralSourceActivities,
        investmentTypesObj: buildMetaDataObj(investmentTypes),
        fdi: await getOptions(token, 'fdi-type', { createdOn }),
        referralSourceActivitiesObj: buildMetaDataObj(referralSourceActivities),
        referralSourceMarketing: await getOptions(token, 'referral-source-marketing', { createdOn }),
        referralSourceWebsite: await getOptions(token, 'referral-source-website', { createdOn }),
        primarySectors: await getOptions(token, 'sector', { createdOn }),
        businessActivities: await getOptions(token, 'investment-business-activity', { createdOn }),
        investmentSpecificProgramme: await getOptions(token, 'investment-specific-programme', { createdOn }),
        investmentInvestorType: await getOptions(token, 'investment-investor-type', { createdOn }),
        investmentInvolvement: await getOptions(token, 'investment-involvement', { createdOn }),
      },
    })

    if (investmentData) {
      // TODO: This is to support the leading question of whether current
      // user is the CRM or adviser - this journey will be changed in the
      // future but until then this supports the settings of that data
      if (investmentData.client_relationship_manager === req.session.user.id) {
        res.locals.form.state.is_relationship_manager = investmentData.client_relationship_manager
      } else {
        res.locals.form.state.is_relationship_manager = 'false'
      }

      if (investmentData.referral_source_adviser === req.session.user.id) {
        res.locals.form.state.is_referral_source = investmentData.referral_source_adviser
      } else {
        res.locals.form.state.is_referral_source = 'false'
      }
    }

    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
}

function handleFormPost (req, res, next) {
  const formattedBody = transformToApi(Object.assign({}, req.body))
  const projectId = res.locals.projectId || req.params.investmentId
  const addKey = req.body['add-item']
  let saveMethod

  // Todo - currently only supports add with non-js,
  // add remove action for non-js later, for now the user just sets the value to nothing.
  if (addKey) {
    req.body[addKey] = flatten([req.body[addKey]])
    req.body[addKey].push('')

    res.locals.form = assign({}, res.locals.form, {
      state: req.body,
    })

    return next()
  }

  if (projectId) {
    saveMethod = updateInvestment(req.session.token, projectId, formattedBody)
  } else {
    saveMethod = createInvestmentProject(req.session.token, formattedBody)
  }

  saveMethod
    .then((result) => {
      res.locals.resultId = result.id
      next()
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        const state = assign({}, req.body, {
          client_contacts: flatten([req.body.client_contacts]),
          business_activities: flatten([req.body.business_activities]),
        })

        res.locals.form = assign({}, res.locals.form, {
          state,
          errors: {
            messages: err.error,
          },
        })
        next()
      } else {
        next(err)
      }
    })
}

function validateForm (req, res, next) {
  const errorMessages = get(res.locals, 'form.errors.messages')

  if (isEmpty(errorMessages)) {
    return next()
  }

  if (!req.body.is_relationship_manager) {
    errorMessages.is_relationship_manager = ['This field is required.']
    delete errorMessages.client_relationship_manager
  }

  if (!req.body.is_referral_source) {
    errorMessages.is_referral_source = ['This field is required.']
    delete errorMessages.referral_source_adviser
  }

  next()
}

module.exports = {
  populateForm,
  handleFormPost,
  validateForm,
}
