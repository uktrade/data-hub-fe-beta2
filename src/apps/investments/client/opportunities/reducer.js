import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'
import transformInvestmentOpportunity from '../../transformers/opportunities'

const initialState = {
  details: {
    incompleteDetailsFields: 0,
    incompleteRequirementsFields: 0,
    detailsFields: {
      name: { label: 'Opportunity name', value: '' },
      description: { label: 'Opportunity description', value: '' },
      ukRegions: {
        label: 'UK location',
        value: [],
      },
      promoters: {
        label: 'Promoters',
        value: [],
      },
      requiredChecks: {
        label: 'Has this opportunity cleared the required checks?',
        value: '',
      },
      leadRelationshipManager: {
        label: 'Lead DIT relationship manager',
        value: '',
      },
      assetClasses: {
        label: 'Asset classes',
        value: [],
      },
      value: {
        label: 'Opportunity value',
        value: '',
      },
      constructionRisks: {
        label: 'Construction risk',
        value: [],
      },
    },
    requirementsFields: {
      totalInvestmentSought: {
        label: 'Total investment sought',
        value: 0,
      },
      currentInvestmentSecured: {
        label: 'Current investment secured',
        value: 0,
      },
      investmentTypes: {
        label: 'Types of investment',
        value: [],
      },
      returnRate: {
        label: 'Estimated return rate',
        value: '',
      },
      timeHorizons: {
        label: 'Timescales',
        value: [],
      },
    },
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        details: transformInvestmentOpportunity(result),
      }
    default:
      return state
  }
}
