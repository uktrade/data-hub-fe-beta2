import React from 'react'

import PageTemplate from '../../gatsby-templates/investments/projects'

const Page = () => {
  // payload will change for each request
  const payload = {
    adviser: null,
    page: 1,
  }

  // current adviser id should be available in session - is it stored in redux?
  const currentAdviserId = ''

  // selected filters can be found in the request params
  const selectedFilters = {
    selectedAdvisers: [],
    selectedStages: [],
    selectedSectors: [],
    selectedCountries: [],
    selectedUkRegions: [],
    selectedProjectStatuses: [],
    selectedInvestmentTypes: [],
    selectedLikelihoodToLands: [],
  }

  // option metadata shouldn't really change, so just rebuild gatsby when they do
  const optionMetadata = {
    projectStageOptions: [],
    sectorOptions: [],
    countryOptions: [],
    ukRegionOptions: [],
    projectStatusOptions: [],
    investmentTypeOptions: [],
    likelihoodToLandOptions: [],
    involvementLevelOptions: [],
  }

  return (
    <PageTemplate
      payload={payload}
      currentAdviserId={currentAdviserId}
      optionMetadata={optionMetadata}
      selectedFilters={selectedFilters}
    />
  )
}

export default Page
