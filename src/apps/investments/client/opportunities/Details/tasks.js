import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import { transformValueForApi } from '../../../../../common/date'

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
    apiProxyAxios.get('/v4/company'),
    apiProxyAxios.get('/adviser/'),
    apiProxyAxios.get(
      '/v4/metadata/large-capital-opportunity/opportunity-value-type'
    ),
  ]).then(
    ([
      { data: ukRegions },
      { data: requiredChecksConducted },
      { data: classes },
      { data: constructionRisks },
      { data: promoters },
      { data: advisers },
      { data: valueTypes },
    ]) => ({
      ukRegions: ukRegions.map(idNameToValueLabel),
      requiredChecksConducted: requiredChecksConducted.map(idNameToValueLabel),
      classesOfInterest: classes.map(idNameToValueLabel),
      constructionRisks: constructionRisks.map(idNameToValueLabel),
      promoters: promoters.results.map(idNameToValueLabel),
      advisers: advisers.results.map(idNameToValueLabel),
      valueTypes: valueTypes.map(idNameToValueLabel),
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
      uk_region_locations: values.ukRegions?.map(({ value }) => value),
      promoters: values.promoters?.map(({ value }) => value),
      required_checks_conducted: values.requiredChecksConducted
        ? values.requiredChecksConducted
        : undefined,
      required_checks_conducted_by: values.requiredChecksConductedBy?.value,
      required_checks_conducted_on: values.requiredChecksConductedOn
        ? transformValueForApi(values.requiredChecksConductedOn)
        : undefined,
      lead_dit_relationship_manager: values.leadRelationshipManager?.value,
      other_dit_contacts: values.otherDitContacts?.map(({ value }) => value),
      asset_classes: values.assetClasses?.map(({ value }) => value),
      opportunity_value: values.opportunityValue
        ? values.opportunityValue
        : undefined,
      // TODO: refactor this to not be in an array once the API is fixed.
      construction_risks: values.constructionRisks.length
        ? [values.constructionRisks]
        : [],
      opportunity_value_type: values.valueType ? values.valueType : undefined,
    })
    .then(({ data }) => {
      return data
    })
}
