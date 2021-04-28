import { apiProxyAxios } from '../../../../client/components/Task/utils'

const idName2valueLabel = ({ id, name }) => ({ value: id, label: name })

export const getOpportunityDetail = (id) =>
  apiProxyAxios.get(`/v4/large-capital-opportunity/${id}`).then(({ data }) => {
    return data
  })

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
      ukRegions: ukRegions.map(idName2valueLabel),
      requiredChecks: requiredChecks.map(idName2valueLabel),
      classesOfInterest: classes.map(idName2valueLabel),
      constructionRisks: constructionRisks.map(idName2valueLabel),
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
      investmentTypes: investmentTypes.map(idName2valueLabel),
      returnRates: returnRates.map(idName2valueLabel),
      timeScales: timeScales.map(idName2valueLabel),
    })
  )
