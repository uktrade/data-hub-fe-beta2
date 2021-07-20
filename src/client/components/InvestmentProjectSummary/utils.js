import { addYears, subtractYears } from '../../utils/date-utils'

/**
 * Converts investment summary received by the API into data ranges
 * that the chart component can work with
 */
export const investmentSummaryAsDataRanges = ({
  annual_summaries: annualSummaries,
  adviser_id: adviserId,
}) => {
  const labelledSummaries = annualSummaries.map(
    ({ financial_year, totals }) => {
      const { start, end } = financial_year
      const startDate = new Date(start)
      const endDate = new Date(end)

      const now = new Date()
      const oneYearAgo = subtractYears(now, 1)
      const oneYearAhead = addYears(now, 1)

      const { label, order } =
        startDate <= now && endDate >= now
          ? {
              label: `Current financial year (${financial_year.label})`,
              order: 0,
            }
          : startDate <= oneYearAgo && endDate >= oneYearAgo
          ? {
              label: `Previous financial year (${financial_year.label})`,
              order: 1,
            }
          : startDate <= oneYearAhead && endDate >= oneYearAhead
          ? {
              label: 'Upcoming financial year',
              order: 2,
            }
          : {
              label: financial_year.label,
              order: 3,
            }

      return {
        label,
        order,
        name: financial_year.start,
        range: Object.entries(totals).map(([, props]) => ({
          ...props,
          link: `/investments/projects?stage=${props.id}&adviser=${adviserId}`,
        })),
      }
    }
  )

  labelledSummaries.sort((a, b) => a.order - b.order)
  return labelledSummaries.map(({ order, ...rest }) => ({ ...rest }))
}
