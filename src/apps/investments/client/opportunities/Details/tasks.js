import { apiProxyAxios } from '../../../../../client/components/Task/utils'

import { transformInvestmentOpportunityDetails } from './transformers'

const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

export const getOpportunityDetails = ({ opportunityId }) =>
  apiProxyAxios
    .get(`/v4/large-capital-opportunity/${opportunityId}`)
    .then(({ data }) => transformInvestmentOpportunityDetails(data))

export const getDetailsMetadata = () =>
  Promise.all([
    apiProxyAxios.get('/v4/metadata/uk-region'),
    apiProxyAxios.get(
      '/v4/metadata/capital-investment/required-checks-conducted'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/asset-class-interest'),
    apiProxyAxios.get('/v4/metadata/capital-investment/construction-risk'),
  ]).then(
    ([
      { data: ukRegions },
      { data: requiredChecks },
      { data: classes },
      { data: constructionRisks },
    ]) => ({
      ukRegions: ukRegions.map(idNameToValueLabel),
      requiredChecks: requiredChecks.map(idNameToValueLabel),
      classesOfInterest: classes.map(idNameToValueLabel),
      constructionRisks: constructionRisks.map(idNameToValueLabel),
    })
  )

export const getRequirementsMetadata = () =>
  Promise.all([
    apiProxyAxios.get(
      'v4/metadata/capital-investment/large-capital-investment-type'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/return-rate'),
    apiProxyAxios.get('/v4/metadata/capital-investment/time-horizon'),
  ]).then(
    ([
      { data: investmentTypes },
      { data: returnRates },
      { data: timeScales },
    ]) => ({
      investmentTypes: investmentTypes.map(idNameToValueLabel),
      returnRates: returnRates.map(idNameToValueLabel),
      timeScales: timeScales.map(idNameToValueLabel),
    })
  )

export function saveOpportunityDetails({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      name: values.name,
      description: values.description,
      opportunity_value: values.opportunityValue,
    })
    .then(({ data }) => {
      return data
    })
}
