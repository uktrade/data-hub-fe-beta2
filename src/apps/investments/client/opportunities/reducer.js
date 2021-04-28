import {
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
  INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
  INVESTMENT_OPPORTUNITY__CANCEL_EDIT,
  INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
} from '../../../../client/actions'
import transformInvestmentOpportunity from '../../transformers/opportunities'

const initialState = {
  details: {
    incompleteDetailsFields: 0,
    incompleteRequirementsFields: 0,
    isEditingDetails: false,
    isEditingRequirements: false,
    detailsFields: {
      name: '',
      description: '',
      ukRegions: [],
      promoters: [],
      requiredChecks: {},
      leadRelationshipManager: {},
      assetClasses: [],
      opportunityValue: {
        label: 'Opportunity value',
        value: 0,
      },
      constructionRisks: [],
    },
    requirementsFields: {
      totalInvestmentSought: 0,
      currentInvestmentSecured: 0,
      investmentTypes: [],
      returnRate: {},
      timeHorizons: [],
    },
  },
  metadata: {
    ukRegions: [],
    requiredChecks: [],
    classesOfInterest: [],
    constructionRisks: [],
    investmentTypes: [],
    returnRates: [],
    timeScales: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        details: transformInvestmentOpportunity(result),
      }
    case INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ukRegions: result.ukRegions,
          requiredChecks: result.requiredChecks,
          classesOfInterest: result.classesOfInterest,
          constructionRisks: result.constructionRisks,
        },
      }
    case INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          investmentTypes: result.investmentTypes,
          returnRates: result.returnRates,
          timeScales: result.timeScales,
        },
      }
    case INVESTMENT_OPPORTUNITY__EDIT_DETAILS:
      return {
        ...state,
        details: {
          ...state.details,
          isEditingDetails: true,
          isEditingRequirements: false,
        },
      }
    case INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS:
      return {
        ...state,
        details: {
          ...state.details,
          isEditingDetails: false,
          isEditingRequirements: true,
        },
      }
    case INVESTMENT_OPPORTUNITY__CANCEL_EDIT:
      return {
        ...state,
        details: {
          ...state.details,
          isEditingDetails: false,
          isEditingRequirements: false,
        },
      }
    case INVESTMENT_OPPORTUNITY__DETAILS_CHANGE:
      return {
        ...state,
        details: Object.assign(state.details, result),
      }
    default:
      return state
  }
}
