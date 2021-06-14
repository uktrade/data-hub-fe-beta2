/* eslint camelcase: 0 */
import { format } from '../../../../client/utils/date-utils'

import urls from '../../../../lib/urls'

const transformInvestmentProjectToListItem = ({
  id,
  name,
  project_code,
  stage,
  investment_type,
  status,
  investor_company,
  estimated_land_date,
  sector,
}) => {
  const badges = [
    { text: stage.name },
    { text: investment_type.name },
    { text: status },
  ]

  const metadata = [
    { label: 'Investor', value: investor_company.name },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: estimated_land_date && format(estimated_land_date, 'MMMM yyyy'),
    },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.projects.details(id),
    headingText: name,
    subheading: `Project code ${project_code}`,
    badges,
    metadata,
  }
}

export default transformInvestmentProjectToListItem
