export const adviserLabel = 'Adviser'
export const countryLabel = 'Country'
export const estimatedLandDateBeforeLabel = 'Estimated land date before'
export const estimatedLandDateAfterLabel = 'Estimated land date after'
export const actualLandDateBeforeLabel = 'Actual land date before'
export const actualLandDateAfterLabel = 'Actual land date after'
export const likelihoodToLandLabel = 'Likelihood to land'
export const investmentTypeLabel = 'Investment type'
export const involvementLevelLabel = 'Level of involvement specified'
export const sectorLabel = 'Sector'
export const ukRegionLabel = 'UK region'
export const stageLabel = 'Stage'
export const projectStatusLabel = 'Status'

export const sortOptions = [
  {
    name: 'Most recently created',
    value: 'created_on:desc',
  },
  {
    name: 'Earliest land date',
    value: 'estimated_land_date:asc',
  },
  {
    name: 'Latest land date',
    value: 'estimated_land_date:desc',
  },
  {
    name: 'Project name',
    value: 'name:asc',
  },
  {
    name: 'Stage',
    value: 'stage.name',
  },
]

export const involvementLevelOptions = [
  { label: 'Involved', value: 'involved' },
  { label: 'Not involved', value: 'not_involved' },
  { label: 'Unspecified', value: 'unspecified' },
]

export const projectStatusOptions = [
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Dormant', value: 'dormant' },
]
