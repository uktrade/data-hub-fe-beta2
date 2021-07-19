import {
  buildDatesFilter,
  buildInputFieldFilter,
  buildOptionsFilter,
} from '../../../client/filters'
import { LABELS } from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedOrganisers
) => ({
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.eventName,
    }),
  },
  organisers: {
    queryParam: 'organiser',
    options: selectedOrganisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.organiser,
    })),
  },
  startDateAfter: {
    queryParam: 'start_date_after',
    options: buildDatesFilter({
      value: queryParams.start_date_after,
      categoryLabel: LABELS.startDateAfter,
    }),
  },
  startDateBefore: {
    queryParam: 'start_date_before',
    options: buildDatesFilter({
      value: queryParams.start_date_before,
      categoryLabel: LABELS.startDateBefore,
    }),
  },
  countries: {
    queryParam: 'country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.country,
      categoryLabel: LABELS.country,
    }),
  },
  ukRegions: {
    queryParam: 'uk_region',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.uk_region,
      categoryLabel: LABELS.ukRegion,
    }),
  },
  eventTypes: {
    queryParam: 'event_type',
    options: buildOptionsFilter({
      options: metadata.eventTypeOptions,
      value: queryParams.event_type,
      categoryLabel: LABELS.eventType,
    }),
  },
})
