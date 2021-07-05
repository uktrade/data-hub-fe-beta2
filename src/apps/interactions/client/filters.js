import { KIND_OPTIONS, BUSINESS_INTELLIGENCE_OPTION, LABELS } from './constants'

import { buildOptionsFilter, buildDatesFilter } from '../../../client/filters'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedAdvisers
) => ({
  kind: {
    queryParam: 'kind',
    options: buildOptionsFilter({
      options: KIND_OPTIONS,
      value: queryParams.kind,
      categoryLabel: LABELS.kind,
    }),
  },
  advisers: {
    queryParam: 'adviser',
    options: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  datesAfter: {
    queryParam: 'date_after',
    options: buildDatesFilter({
      value: queryParams.date_after,
      categoryLabel: LABELS.dateAfter,
    }),
  },
  datesBefore: {
    queryParam: 'date_before',
    options: buildDatesFilter({
      value: queryParams.date_before,
      categoryLabel: LABELS.dateBefore,
    }),
  },
  service: {
    queryParam: 'service',
    options: buildOptionsFilter({
      options: metadata.serviceOptions,
      value: queryParams.service,
      categoryLabel: LABELS.service,
    }),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: LABELS.sector,
    }),
  },
  businessIntelligence: {
    queryParam: 'was_policy_feedback_provided',
    options: buildOptionsFilter({
      options: BUSINESS_INTELLIGENCE_OPTION,
      value: queryParams.was_policy_feedback_provided,
      categoryLabel: LABELS.businessIntelligence,
    }),
  },
  policyArea: {
    queryParam: 'policy_areas',
    options: buildOptionsFilter({
      options: metadata.policyAreaOptions,
      value: queryParams.policy_areas,
      categoryLabel: LABELS.policyAreas,
    }),
  },
})
