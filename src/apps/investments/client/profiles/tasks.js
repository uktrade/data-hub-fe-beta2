import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getLargeCapitalProfiles({
  limit = 10,
  page,
  countryOfOrigin,
  assetClassesOfInterest,
  investorCompanyName,
  investorTypes,
}) {
  let offset = limit * (parseInt(page, 10) - 1) || 0
  return apiProxyAxios
    .post('/v4/search/large-investor-profile', {
      limit,
      offset,
      country_of_origin: countryOfOrigin,
      investor_type: investorTypes,
      asset_classes_of_interest: assetClassesOfInterest,
      ...(investorCompanyName
        ? { investor_company_name: investorCompanyName }
        : {}),
    })
    .then(({ data }) => {
      return data
    })
}

const idName2valueLabel = ({ id, name }) => ({ value: id, label: name })

export const loadFilterOptions = () =>
  Promise.all([
    apiProxyAxios.get('/v4/metadata/country'),
    apiProxyAxios.get('/v4/metadata/capital-investment/asset-class-interest'),
    apiProxyAxios.get('/v4/metadata/capital-investment/investor-type'),
  ]).then(
    ([{ data: countries }, { data: classes }, { data: investorTypes }]) => ({
      countries: countries.map(idName2valueLabel),
      assetClassesOfInterest: classes.map(idName2valueLabel),
      investorTypes: investorTypes.map(idName2valueLabel),
    })
  )
